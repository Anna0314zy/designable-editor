`RecoveryManager` 是**断线恢复管理器**。

它解决三个问题：

1. 客户端已经处理到哪条消息？
2. 恢复过程中收到的新消息怎么办？
3. 快照和增量消息重复时，哪些消息需要继续应用？

一句话：

> 它负责记录消息进度、发现消息缺口、暂存恢复期间的消息，并协调快照与增量消息。

---

## 为什么需要它

假设服务端按顺序发送：

```text
seq=101 学生举手
seq=102 课件翻页
seq=103 学生答题
```

客户端处理完 `101` 后断线了：

```text
客户端 lastSeq = 101
```

重连时告诉服务端：

```json
{
  "kind": "subscribe",
  "lastSeq": 101
}
```

服务端就知道需要补发：

```text
102、103
```

这里的 `lastSeq` 就由 `RecoveryManager` 管理。

---

## 两套序号

代码中有两个容易混淆的字段：

### `seq`

消息流序号：

```text
消息1 seq=1
消息2 seq=2
消息3 seq=3
```

用于判断：

- 是否重复
- 是否乱序
- 是否缺消息
- 从哪里开始恢复

### `version`

业务状态版本：

```text
快照 version=10
事件 version=8
事件 version=11
```

用于判断一条业务事件是否已经包含在服务端快照里。

可以理解为：

```text
seq：消息通道处理到哪
version：业务状态更新到哪
```

---

## 字段解释

### `buffer`

```ts
private buffer = new Map<number, BusinessEvent>()
```

恢复期间的消息缓冲区。

为什么需要缓冲？

```text
WebSocket 重连成功
→ 服务端开始补发消息
→ 同时实时新消息也到达
→ 服务端快照还没到
```

如果立即更新 Store，之后旧快照到达，可能把新状态覆盖掉。

所以先存起来：

```ts
bufferEvent(event) {
  this.buffer.set(event.seq, event)
}
```

使用 `seq` 作为 key 还有一个作用：同一个序号重复进入时，只保留一份。

---

### `currentSeq`

```ts
private currentSeq: number
```

客户端最后确认处理完成的消息序号。

例如：

```text
currentSeq = 100
```

表示：

> 1 到 100 的消息已经处理完成，下一条应该是 101。

---

### 构造函数

```ts
constructor(private readonly storageKey: string) {
  this.currentSeq = this.readLastSeq()
}
```

创建管理器时，从 `localStorage` 恢复上次处理位置。

不同课堂使用不同 key：

```text
websocket:live-001:main:lastSeq
websocket:live-002:main:lastSeq
```

避免不同课堂的消息进度互相污染。

---

## `lastSeq`

```ts
get lastSeq() {
  return this.currentSeq
}
```

对外提供最后处理的消息序号。

重连订阅时会用：

```ts
send({
  kind: 'subscribe',
  liveId,
  lastSeq: recoveryManager.lastSeq
})
```

---

## `bufferedCount`

```ts
get bufferedCount() {
  return this.buffer.size
}
```

返回当前暂存了多少条恢复消息。

主要用于：

- 页面显示恢复进度
- 监控缓冲是否异常增长
- 排查恢复过程是否卡住

---

## `bufferEvent`

```ts
bufferEvent(event: BusinessEvent) {
  this.buffer.set(event.seq, event)
}
```

把恢复期间收到的消息存起来。

例如：

```text
buffer:
102 -> 课件翻页
104 -> 学生答题
103 -> 学生举手
```

消息可以乱序进入，最后会按 `seq` 排序。

---

## `classify`

```ts
classify(event): 'old' | 'gap' | 'next'
```

判断收到的事件和当前消息进度是什么关系。

### `old`

```ts
if (event.seq <= this.currentSeq) return 'old'
```

例如：

```text
currentSeq = 100
收到 seq = 99
```

说明是重复或迟到的旧消息，不应该再次处理。

### `gap`

```ts
if (event.seq !== this.currentSeq + 1) return 'gap'
```

例如：

```text
currentSeq = 100
期待 seq = 101
实际收到 seq = 103
```

说明 `101、102` 可能丢失了。

此时不能直接处理 `103`，应该：

```text
缓存 103
→ 请求消息恢复
→ 补回 101、102
→ 按顺序处理
```

### `next`

```ts
return 'next'
```

例如：

```text
currentSeq = 100
收到 seq = 101
```

消息连续，可以正常处理。

---

## `commit`

```ts
commit(seq: number) {
  this.currentSeq = seq
  localStorage.setItem(this.storageKey, String(seq))
}
```

表示这条消息已经处理完成。

例如：

```text
处理 seq=101
→ commit(101)
→ currentSeq=101
→ 下一条期待 102
```

同时保存进 `localStorage`，页面刷新或重连后仍然知道处理位置。

注意：应当在业务确认接受消息时再提交。如果业务处理可能抛错，理论上应该：

```ts
applyBusinessEvent(event)
recoveryManager.commit(event.seq)
```

当前 Demo 是先更新进度再通过事件总线交给业务，这在严格生产场景还有优化空间。更严谨的是业务处理成功后再 commit。

---

## `complete`

这是最核心的方法：

```ts
complete(snapshotVersion)
```

表示服务端快照已经到达，现在处理恢复缓冲区。

### 第一步：按 seq 排序

```ts
const events = [...this.buffer.values()]
  .sort((a, b) => a.seq - b.seq)
```

缓冲区可能是：

```text
104、102、103
```

排序后：

```text
102、103、104
```

### 第二步：清空旧缓冲

```ts
this.buffer.clear()
```

这一批消息已经被取出处理。

### 第三步：判断是否已包含在快照中

```ts
if (event.version <= snapshotVersion)
```

假设服务端快照：

```text
snapshotVersion = 20
```

缓冲消息：

```text
event A version=18
event B version=20
event C version=21
```

那么：

```text
A、B 已经反映在快照中，不再重复应用
C 比快照更新，需要继续应用
```

因此：

```ts
if (event.version <= snapshotVersion) {
  discardedEvents++
} else {
  toApply.push(event)
}
```

这里的 `discarded` 不是消息丢失，而是：

> 这条增量消息已经包含在快照里，所以不再重复更新业务。

### 第四步：推进消息序号

即使消息已经包含在快照中，也需要：

```ts
this.commit(Math.max(this.currentSeq, event.seq))
```

否则客户端下次重连还会从旧序号继续恢复，再次收到这些消息。

---

## 完整场景

断线前：

```text
currentSeq = 100
```

断线期间发生：

```text
seq=101 version=11 学生举手
seq=102 version=12 课件翻页
```

重连后又发生：

```text
seq=103 version=13 学生答题
```

服务端返回快照：

```text
snapshotVersion=12
```

恢复缓冲：

```text
101 version=11
102 version=12
103 version=13
```

执行：

```ts
complete(12)
```

结果：

```text
101：已经包含在快照，丢弃增量处理
102：已经包含在快照，丢弃增量处理
103：快照未包含，放入 toApply
```

最终：

```ts
{
  toApply: [seq103],
  discardedEvents: 2
}
```

业务处理顺序：

```text
先应用 version=12 的快照
→ 再应用 version=13 的答题事件
→ 最终状态不会被旧快照覆盖
```

---

## 需要注意的一个问题

当前代码这部分：

```ts
for (const event of events) {
  if (event.version <= snapshotVersion) {
    this.commit(Math.max(this.currentSeq, event.seq))
  } else {
    toApply.push(event)
  }
}
```

如果缓冲是：

```text
seq=101 version=11
seq=102 version=13
```

快照版本是 `12`：

- `101` 推进 currentSeq
- `102` 放进 `toApply`

上层还需要按顺序成功应用 `102` 后再 `commit(102)`。

所以 `complete()` 只负责分类，真正应用和最终提交仍由 `WebSocketManager` 编排。

一句话总结：

> `RecoveryManager` 像客户端的消息游标管理器。它用 `lastSeq` 记录消费位置，用 buffer 暂存恢复期间消息，用 `seq` 检测重复和缺口，再用业务 `version` 判断增量消息是否已经被服务端快照覆盖。