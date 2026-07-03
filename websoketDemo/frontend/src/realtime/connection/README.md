`latency` 表示 WebSocket 当前的**网络往返延迟**，通常单位是毫秒。

计算方式：

```text
客户端发送 ping 的时间
        ↓
服务端收到后返回 pong
        ↓
客户端收到 pong 的时间 - ping 发送时间
```

例如：

```ts
// 发送
send({
  kind: 'ping',
  clientTime: Date.now()
})

// 收到 pong
latency = Date.now() - message.requestTime
```

如果结果是：

```ts
latency = 85
```

表示一次客户端到服务端、再回到客户端大约用了 `85ms`。

主要有四个用途。

### 1. 展示网络质量

可以划分为：

```ts
function getNetworkLevel(latency: number) {
  if (latency < 100) return 'good'
  if (latency < 300) return 'normal'
  if (latency < 800) return 'poor'
  return 'bad'
}
```

授课端可以显示：

```text
网络良好
网络一般
网络较差
```

但不能只看 latency，还应结合断线次数、消息超时和 RTC 丢包率。

### 2. 监控和问题排查

例如用户反馈：

> 学生举手后老师端很久才显示。

日志中可以同时记录：

```json
{
  "latency": 950,
  "reconnectAttempts": 2,
  "pendingCommands": 3
}
```

可以辅助判断是前端逻辑慢，还是当时网络延迟高。

### 3. 弱网策略

延迟持续过高时，可以触发降级：

```ts
if (latency > 1000) {
  showWeakNetworkTip()
}
```

或者：

- 减少非关键消息发送
- 合并高频状态消息
- 延长命令确认超时
- 提示教师检查网络

不建议因为单次延迟高就立即降级，应看连续多次数据。

### 4. 判断连接健康度

`WebSocket.OPEN` 不代表连接一定可用。网络切换后，socket 可能暂时仍显示 `OPEN`，但消息已经无法到达服务端。

如果发送 ping 后长期收不到 pong，不只是 latency 变高，而应该触发**心跳超时**并关闭连接、开始重连。

因此：

```text
收到 pong
→ 更新 latency

超过 heartbeatTimeout 没收到 pong
→ 判断为假连接
→ 主动关闭
→ 自动重连
```

需要注意：这个值不是纯网络延迟，它还包含：

- 客户端事件循环等待时间
- 服务端处理 ping 的时间
- 浏览器后台定时器降频
- 网络传输时间

因此更准确地称为 **RTT（Round-Trip Time，往返时间）**。

面试可以回答：

> `latency` 是通过应用层 ping/pong 计算的往返耗时，主要用于网络质量展示、弱网判断和链路监控。如果超过心跳超时时间仍然收不到 pong，就认为是半开或假连接，主动断开并重连。