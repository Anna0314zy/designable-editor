`MessageDeduplicator` 是一个**消息去重器**。

它解决的问题是：

> 同一条服务端消息可能被客户端收到多次，但业务只能执行一次。

## 为什么会出现重复消息

假设服务端发送一条“学生奖励 2 分”：

```json
{
  "msgId": "msg-001",
  "type": "STUDENT_SCORE_CHANGED",
  "payload": {
    "stuId": "stu_001",
    "score": 10
  }
}
```

正常流程：

```text
服务端发送 msg-001
→ 客户端收到并回复 ACK
→ 服务端收到 ACK，不再发送
```

但如果 ACK 丢失：

```text
服务端发送 msg-001
→ 客户端收到并处理
→ 客户端回复 ACK
→ ACK 网络丢失
→ 服务端认为客户端没收到
→ 服务端重新发送 msg-001
```

如果客户端再次执行业务，可能出现：

```text
奖励重复
重复弹窗
重复插入聊天消息
答题人数重复增加
学生重复上台
```

因此客户端需要记录已经处理过的 `msgId`。

## 使用流程

在 `WebSocketManager` 中类似：

```ts
if (deduplicator.has(message.msgId)) {
  // 这条消息以前处理过
  // 不再更新业务
  return
}

deduplicator.add(message.msgId)
applyBusinessEvent(message)
```

完整流程：

```text
收到消息
  ↓
先回复 ACK
  ↓
检查 msgId
  ├─ 已存在：重复消息，不再执行业务
  └─ 不存在：记录 msgId，继续处理业务
```

即使是重复消息，也需要重新回复 ACK，否则服务端还会继续重发。

---

## 字段解释

### `messages`

```ts
private messages = new Map<string, number>()
```

保存：

```text
msgId -> 收到消息的时间
```

例如：

```ts
Map {
  'msg-001' => 1710000000000,
  'msg-002' => 1710000001000
}
```

为什么还要保存时间？

因为不能永久保存所有 `msgId`，否则应用长时间运行后内存会一直增长。时间用于删除过期记录。

---

## `ttlMs`

```ts
constructor(private readonly ttlMs: number) {}
```

TTL 是 Time To Live，表示去重记录保留多久。

例如：

```ts
const deduplicator = new MessageDeduplicator(5 * 60 * 1000)
```

表示：

```text
msgId 保留 5 分钟
```

5 分钟内再次收到相同消息，会被认为是重复消息。

超过 5 分钟记录会被清理。

TTL 应该大于服务端的最大重投和消息恢复时间窗口。

---

## `has`

```ts
has(msgId: string) {
  return this.messages.has(msgId)
}
```

检查该消息是否处理过。

```ts
if (deduplicator.has(message.msgId)) {
  console.log('重复消息，忽略业务处理')
}
```

---

## `add`

```ts
add(msgId: string) {
  this.messages.set(msgId, Date.now())
  this.cleanup()
}
```

记录一条新消息已经处理。

保存以后立即清理过期记录，防止 Map 无限增长。

例如：

```ts
deduplicator.add('msg-001')
```

得到：

```ts
Map {
  'msg-001' => 当前时间
}
```

---

## `size`

```ts
get size() {
  return this.messages.size
}
```

返回当前保存了多少个 `msgId`。

主要用于：

- 监控内存
- 页面指标展示
- 排查去重缓存是否增长异常

---

## `cleanup`

```ts
private cleanup() {
  const expireBefore = Date.now() - this.ttlMs

  for (const [msgId, time] of this.messages) {
    if (time < expireBefore) {
      this.messages.delete(msgId)
    }
  }
}
```

假设：

```text
当前时间：10:10
TTL：5 分钟
```

那么：

```text
10:05 以前的记录会被删除
10:05 以后的记录继续保留
```

---

## 举手场景

第一次收到：

```text
msgId=101
学生 A 举手=true
```

处理：

```ts
has('101') // false
add('101')
student.isHandUp = true
```

服务端重发：

```text
msgId=101
学生 A 举手=true
```

处理：

```ts
has('101') // true
return
```

学生状态不会重复更新。

举手本身是幂等操作，即使重复设置 `true` 问题不大，但奖励、计数和弹窗等副作用业务必须去重。

## 和 `seq` 的区别

`msgId` 和 `seq` 作用不同。

### `msgId`

判断是不是**同一条消息**：

```text
同一个 msgId 再次出现
→ 重复投递
```

### `seq`

判断消息顺序是否连续：

```text
当前 lastSeq=10
收到 seq=12
→ 可能丢了 seq=11
```

所以：

```text
msgId：解决重复
seq：解决顺序、缺失和恢复位置
```

## 和业务幂等的区别

去重器是消息层防线：

```text
相同 msgId 只交给业务一次
```

业务幂等是业务层防线：

```text
即使消息意外执行两次，最终状态仍然正确
```

生产系统最好两层都做：

```text
MessageDeduplicator 防重复投递
+
业务 Store 幂等更新防止状态副作用
```

一句话总结：

> `MessageDeduplicator` 使用 `msgId` 记录最近已经处理过的服务端消息。当 ACK 丢失导致服务端重投时，客户端仍回复 ACK，但不会再次执行业务；同时通过 TTL 清理旧记录，避免内存无限增长。