`PendingCommands` 管理的是：

> 客户端已经通过 WebSocket 发出，但服务端还没有返回 `command_ack` 的命令。

例如教师点击“学生上台”：

```text
发送 stage.set
    ↓
放入 PendingCommands
    ↓
等待 command_ack
    ├─ 成功：resolve Promise
    ├─ 失败：reject Promise
    ├─ 超时：reject Promise
    └─ 断线：决定失败还是重连后重试
```

## commands

```ts
private commands = new Map<string, PendingCommand>()
```

保存所有等待 ACK 的命令。

```text
key   = clientMsgId
value = 命令、Promise、超时定时器、重试配置
```

使用 `clientMsgId` 是因为 ACK 中也会携带它：

```ts
{
  kind: 'command_ack',
  clientMsgId: 'abc-123',
  success: true
}
```

这样可以准确找到 ACK 对应的请求。

---

## constructor

```ts
constructor(
  private readonly timeoutMs: number,
  private readonly send: (command: ClientCommand) => boolean,
  private readonly onChange: () => void
) {}
```

接收三个依赖。

### `timeoutMs`

等待 ACK 的最长时间：

```ts
timeoutMs = 5000
```

超过 5 秒还没有 ACK，就认为命令失败。

### `send`

真正发送 WebSocket 消息的方法：

```ts
command => this.sendRaw(command)
```

`PendingCommands` 不需要直接依赖 `WebSocketTransport`。

### `onChange`

Pending 数量变化后的通知：

```ts
() => this.emitMetrics()
```

用于更新页面中的：

```text
Pending: 2
```

---

## dispatch

```ts
dispatch(
  command: ClientCommand,
  options: CommandOptions,
  existing?: PendingCommand
)
```

负责发送命令并开始等待 ACK。

### 发送新命令

```ts
return new Promise<CommandResult>((resolve, reject) => {
  this.arm({
    command,
    options,
    resolve,
    reject,
    timer: null
  })
})
```

它创建 Promise，并将：

- 命令
- 配置
- `resolve`
- `reject`
- 定时器

组合成 `PendingCommand`。

业务可以这样等待结果：

```ts
await manager.sendCommand('stage.set', {
  stuId: 'stu_001',
  onStage: true
})
```

收到成功 ACK 后，`await` 才结束。

### 重试旧命令

```ts
if (existing) {
  this.arm(existing)
  return Promise.resolve<CommandResult>({})
}
```

`existing` 表示这条命令之前已经发送过，但因为断线被放进了 Outbox。

这里复用原来的：

```ts
existing.resolve
existing.reject
```

因此原业务 Promise 最终仍由服务端 ACK 决定。

不过这里返回的 `Promise.resolve({})` 只是内部 `flushOutbox()` 使用的“本次重新发送完成”结果，不代表服务端已经确认。

这段 API 容易误解，更合理的方式是把新发送和重新发送拆成两个方法。

---

## resolve

```ts
resolve(message: CommandAck)
```

收到服务端 `command_ack` 后调用。

### 找到对应命令

```ts
const pending = this.commands.get(message.clientMsgId)
if (!pending) return
```

通过 ACK 中的 `clientMsgId` 找到命令。

找不到可能是：

- 已经超时
- 已经处理过
- 重复 ACK
- 客户端重启后收到旧 ACK

这些情况直接忽略。

### 清除超时定时器

```ts
if (pending.timer) clearTimeout(pending.timer)
```

ACK 已经回来，不应该再触发“命令确认超时”。

### 从 Pending 删除

```ts
this.commands.delete(message.clientMsgId)
```

该命令已经有结果，不再是 Pending 状态。

### 完成业务 Promise

```ts
message.success
  ? pending.resolve({ack: message})
  : pending.reject(new Error(message.error || '命令执行失败'))
```

服务端执行成功：

```ts
pending.resolve({ack: message})
```

服务端拒绝或执行失败：

```ts
pending.reject(new Error(message.error))
```

### 通知指标变化

```ts
this.onChange()
```

例如 Pending 数量从 `1` 变成 `0`。

---

## drain

```ts
drain(
  error: Error,
  shouldRetry: (pending: PendingCommand) => boolean
)
```

连接断开、主动关闭或 Manager 销毁时，批量处理所有 Pending 命令。

### 准备重试列表

```ts
const retryable: PendingCommand[] = []
```

保存断线后允许重试的命令。

### 遍历全部 Pending

```ts
for (const pending of this.commands.values()) {
```

### 停止原来的超时计时

```ts
if (pending.timer) clearTimeout(pending.timer)
```

连接已经断开，原来的 ACK 定时器没有意义。

### 决定重试还是失败

```ts
if (shouldRetry(pending)) {
  retryable.push(pending)
} else {
  pending.reject(error)
}
```

例如：

```ts
pending.options.retryOnReconnect === true
```

允许重试的命令交给 Outbox。

不允许重试的命令立即让业务 Promise 失败。

### 清空 Pending

```ts
this.commands.clear()
```

因为所有命令都已经：

- 转入重试列表，或者
- 被 reject

### 返回可重试命令

```ts
return retryable
```

Manager 会把它们放入 Outbox：

```ts
for (const pending of retryable) {
  this.enqueueOutbox(
    pending.command,
    pending.options,
    pending
  )
}
```

---

## size

```ts
get size() {
  return this.commands.size
}
```

返回当前正在等待 ACK 的命令数量。

用于监控指标：

```ts
pendingCommands: this.pending.size
```

---

## arm

```ts
private arm(pending: PendingCommand)
```

`arm` 可以理解为：

> 为一条命令装配发送、Pending 注册和 ACK 超时机制。

### 创建 ACK 超时定时器

```ts
pending.timer = setTimeout(() => {
  this.commands.delete(command.clientMsgId)
  pending.reject(
    new Error(`命令确认超时：${command.type}`)
  )
  this.onChange()
}, this.timeoutMs)
```

超过指定时间没有 ACK：

1. 从 Pending 删除。
2. 拒绝业务 Promise。
3. 更新 Pending 指标。

### 注册 Pending

```ts
this.commands.set(command.clientMsgId, pending)
```

必须在发送前注册。

否则极端情况下服务端 ACK 回来特别快，可能出现：

```text
发送命令
ACK 返回
此时 Map 里还没有命令
```

### 发送命令

```ts
if (!this.send(command)) {
```

底层发送失败时：

```ts
clearTimeout(pending.timer)
this.commands.delete(command.clientMsgId)
pending.reject(new Error('WebSocket 发送失败'))
```

清除定时器、移除记录并拒绝 Promise。

### 更新指标

```ts
this.onChange()
```

通知 UI 当前 Pending 数量发生变化。

---

一句话概括：

> `PendingCommands` 使用 `clientMsgId` 管理请求与 ACK 的对应关系，为每条已发送命令创建超时计时器；收到 ACK 后完成原业务 Promise，断线时则根据命令配置决定立即失败还是转入 Outbox 等待重试。

`PendingCommands` 不是业务层直接使用，而是由 `WebSocketManager` 内部调用。

## 1. 创建实例

在 `WebSocketManager` 构造函数中：

```ts
this.pending = new PendingCommands(
  this.options.commandTimeout,

  // 真正发送 WebSocket 消息
  command => this.sendRaw(command),

  // Pending 数量变化时更新监控数据
  () => this.emitMetrics()
)
```

## 2. 业务发送命令

业务层调用：

```ts
await manager.sendCommand(
  'student.setHandUp',
  {
    stuId: 'stu_001',
    isHandUp: true
  },
  {
    retryOnReconnect: true
  }
)
```

进入 `WebSocketManager.sendCommand()`：

```ts
return this.pending.dispatch(command, options)
```

`dispatch()` 会：

```text
创建 Promise
注册到 commands Map
设置 ACK 超时定时器
通过 sendRaw() 发送命令
```

此时：

```ts
await manager.sendCommand(...)
```

会一直等待，不会立即结束。

## 3. 服务端返回 ACK

服务端处理完成后返回：

```json
{
  "kind": "command_ack",
  "clientMsgId": "客户端原来的消息 ID",
  "success": true,
  "serverTime": 1710000000000
}
```

客户端在 `handleMessage()` 中收到：

```ts
case 'command_ack':
  this.pending.resolve(message)
  break
```

`PendingCommands.resolve()` 根据 `clientMsgId` 找到命令：

```ts
const pending = this.commands.get(message.clientMsgId)
```

然后完成业务 Promise：

```ts
pending.resolve({ack: message})
```

于是业务层的 `await` 才继续执行：

```ts
try {
  await manager.sendCommand('student.setHandUp', payload)
  console.log('服务端已经确认命令')
} catch (error) {
  console.log('命令失败或者确认超时')
}
```

## 4. 超时场景

如果超过 5 秒没有收到 ACK：

```ts
pending.timer = setTimeout(() => {
  pending.reject(new Error('命令确认超时'))
}, 5000)
```

业务层进入 `catch`：

```ts
try {
  await manager.sendCommand(...)
} catch (error) {
  // 显示“操作失败，请重试”
}
```

## 5. 断线场景

连接断开后，Manager 调用：

```ts
this.drainPending(
  new Error('连接已断开'),
  true
)
```

内部判断：

```ts
pending.options.retryOnReconnect
```

不允许重试：

```ts
pending.reject(error)
```

允许重试：

```ts
this.enqueueOutbox(
  pending.command,
  pending.options,
  pending
)
```

重连恢复后：

```ts
this.flushOutbox()
```

重新发送原命令，并继续等待对应 ACK。

## 完整调用链

```text
业务组件
  manager.sendCommand()
          ↓
WebSocketManager
  pending.dispatch()
          ↓
PendingCommands
  注册 Map + 设置超时 + sendRaw()
          ↓
服务端执行命令
          ↓
返回 command_ack
          ↓
WebSocketManager.handleMessage()
          ↓
pending.resolve()
          ↓
业务 await 继续执行
```

业务只需要调用：

```ts
await manager.sendCommand(type, payload, options)
```

不需要知道 `PendingCommands` 的存在。这也是封装它的目的。