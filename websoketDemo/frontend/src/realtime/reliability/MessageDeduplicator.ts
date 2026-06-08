/**
 * 保存最近处理过的 msgId，避免 ACK 丢失造成的服务端重投被重复执行业务。
 */
export class MessageDeduplicator {
  private messages = new Map<string, number>()

  constructor(private readonly ttlMs: number) {}

  has(msgId: string) {
    return this.messages.has(msgId)
  }

  add(msgId: string) {
    this.messages.set(msgId, Date.now())
    this.cleanup()
  }

  get size() {
    return this.messages.size
  }

  private cleanup() {
    const expireBefore = Date.now() - this.ttlMs
    for (const [msgId, time] of this.messages) {
      if (time < expireBefore) this.messages.delete(msgId)
    }
  }
}
