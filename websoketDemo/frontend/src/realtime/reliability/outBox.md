这个 `Outbox` 是客户端的**离线命令发件箱**。

它解决的问题是：

> WebSocket 断开或正在恢复时，用户发起的某些操作不能立即发送，是否可以暂存，等连接恢复后再发送？

比如：

```text
网络断开
→ 老师点击发送聊天消息
→ WebSocket 无法发送
→ 消息进入 Outbox
→ WebSocket 恢复到 ready
→ 从 Outbox 取出并发送
```

但不是所有命令都适合进入 Outbox，必须由业务显式指定：

```ts
sendCommand('chat.send', payload, {
  queueWhenOffline: true
})
```

---

## 它管理什么

`Outbox` 主要管理三件事：

1. **容量限制**：最多缓存多少条命令。
2. **TTL**：命令多久后过期。
3. **合并策略**：同类命令只保留最新一条。

它不负责：

- WebSocket 发送
- 自动重连
- 等待 `command_ack`
- 业务 Store 更新

这些由 `WebSocketManager` 和 `PendingCommands` 负责。

---

## `items`

```ts
private items: OutboxItem[] = []
```

保存等待发送的命令。

每一项大概是：

```ts
interface OutboxItem {
  command: ClientCommand
  options: CommandOptions
  expiresAt: number
  pending?: PendingCommand
}
```

例如：

```ts
{
  command: {
    clientMsgId: 'client-001',
    type: 'courseware.setPage',
    payload: {page: 5}
  },
  options: {
    queueWhenOffline: true,
    ttlMs: 10000,
    dedupeKey: 'courseware-current-page'
  },
  expiresAt: 1710000010000
}
```

---

## `limit`

```ts
constructor(private readonly limit: number) {}
```

设置最多保存多少条命令。

例如：

```ts
const outbox = new Outbox(100)
```

最多保存 100 条。

为什么需要限制？

如果断网几个小时，用户持续操作，没有限制会导致：

- 内存不断增长
- 恢复后瞬间发送大量过期命令
- 服务端压力过大
- 旧操作污染当前课堂

---

## `enqueue`

```ts
enqueue(command, options, pending?)
```

把一条命令加入 Outbox。

它分为四步。

### 1. 查找是否需要合并

```ts
let replaced: OutboxItem | undefined

if (options.dedupeKey) {
  const index = this.items.findIndex(
    item => item.options.dedupeKey === options.dedupeKey
  )

  if (index >= 0) {
    replaced = this.items.splice(index, 1)[0]
  }
}
```

`dedupeKey` 表示这类命令只需要保留最新状态。

比如断线时老师连续翻页：

```text
第 2 页
第 3 页
第 4 页
```

三个命令都使用：

```ts
dedupeKey: 'courseware-current-page'
```

每次加入新命令时，先删除相同 `dedupeKey` 的旧命令。

最终 Outbox 只有：

```text
当前页 = 4
```

这里叫 `replaced`，表示被最新命令替换掉的旧命令。

### 2. 添加新命令

```ts
this.items.push({
  command,
  options,
  expiresAt: Date.now() + (options.ttlMs ?? 30_000),
  pending
})
```

命令进入队尾。

`expiresAt` 是绝对过期时间：

```ts
当前时间 + TTL
```

没有指定时，默认保存 30 秒。

例如：

```ts
ttlMs: 10_000
```

表示命令 10 秒内有效。

### 3. 执行容量限制

```ts
const dropped =
  this.items.length > this.limit
    ? this.items.shift()
    : undefined
```

如果加入后超过容量，就删除队头最早的命令。

例如容量为 3：

```text
Outbox：[A, B, C]
新命令：D
```

加入后：

```text
[A, B, C, D]
```

超过限制，删除 A：

```text
[B, C, D]
```

被删除的 A 通过 `dropped` 返回。

### 4. 返回被替换或丢弃的命令

```ts
return {dropped, replaced}
```

为什么要返回？

因为 Outbox 本身只负责队列规则，不负责 Promise 和日志。上层拿到以后可以处理：

```ts
const {dropped, replaced} = outbox.enqueue(...)

dropped?.pending?.reject(
  new Error('Outbox 超出容量')
)

replaced?.pending?.reject(
  new Error('命令被更新操作替代')
)
```

这是模块职责分离：

```text
Outbox：判断谁被丢弃/替换
Manager：记录日志、结束 Promise
```

---

## `pending` 是什么

```ts
pending?: PendingCommand
```

通常有两种进入 Outbox 的情况。

### 情况一：还没发送就断线

```text
用户操作
→ 发现 WebSocket 未 ready
→ 直接进入 Outbox
```

此时可能没有需要长期等待的 Promise，所以 `pending` 可以为空。

### 情况二：已经发送，但等待 ACK 时断线

```text
命令已经发送
→ 正在 pending
→ 连接断开
→ retryOnReconnect=true
→ 命令进入 Outbox
```

这时原调用方还在等待结果：

```ts
await sendCommand(...)
```

所以需要把原 `PendingCommand` 一起保存。重连后使用相同的：

- `clientMsgId`
- `resolve`
- `reject`

继续等待服务端确认。

---

## `takeAll`

```ts
takeAll() {
  return this.items.splice(0)
}
```

取出全部待发送命令，并清空 Outbox。

例如：

```ts
items = [A, B, C]

const queued = takeAll()
```

结果：

```text
queued = [A, B, C]
items = []
```

连接恢复到 `ready` 后，Manager 会调用：

```ts
const queued = outbox.takeAll()

for (const item of queued) {
  // 检查是否过期
  // 没过期就发送
}
```

为什么不在 `Outbox` 里直接发送？

因为 Outbox 不应该依赖 WebSocket，也不应该管理 ACK。它只是队列。

---

## `size`

```ts
get size() {
  return this.items.length
}
```

返回当前积压了多少条命令。

用于：

- 页面指标
- 监控上报
- 判断是否存在大量积压
- 排查连接恢复后为何操作延迟

---

## TTL 在哪里真正检查

这个文件只计算：

```ts
expiresAt
```

真正是否过期，在 `WebSocketManager.flushOutbox()` 中判断：

```ts
if (item.expiresAt <= Date.now()) {
  // 丢弃，不发送
}
```

为什么恢复后要检查 TTL？

假设老师断线时点击：

```text
发起互动
```

30 秒后连接恢复，但课堂可能已经进入其他环节。这条旧命令再发送就会造成错误。

---

## 哪些命令适合进入 Outbox

通常适合：

- 聊天消息
- 日志上报
- 用户备注
- 可以覆盖的最终状态
- 可通过 `clientMsgId` 保证幂等的命令

谨慎使用：

- 课件翻页
- 麦克风开关
- 学生上下台
- 发起/结束互动
- 私聊开始/结束

这些命令强依赖当时的课堂上下文，TTL 应该很短，或者不允许离线排队。

不适合：

- 支付
- 删除
- 扣分
- 不可逆操作
- 无法保证服务端幂等的操作

---

## 完整流程

```text
sendCommand
   ↓
WebSocket 是否 ready？
   ├─ ready
   │    ↓
   │  直接发送并进入 PendingCommands
   │
   └─ 未 ready
        ↓
      queueWhenOffline 是否为 true？
        ├─ false → 返回失败
        └─ true
             ↓
          Outbox.enqueue
             ↓
       dedupeKey 合并旧命令
             ↓
          设置 expiresAt
             ↓
          检查容量 limit
             ↓
       等连接恢复到 ready
             ↓
          Outbox.takeAll
             ↓
          检查 TTL
             ↓
       交给 PendingCommands 发送
```

一句话总结：

> `Outbox` 是客户端离线命令队列。它不负责连接和发送，只负责暂存允许离线排队的命令，并通过容量限制防止内存增长，通过 TTL 丢弃过期操作，通过 `dedupeKey` 合并同类状态命令。