import type {ClientCommand} from '../protocol'
import type {CommandOptions, OutboxItem, PendingCommand} from '../types'

export interface OutboxEnqueueResult {
  dropped?: OutboxItem
  replaced?: OutboxItem
}

/**
 * 离线发件箱，统一处理容量、TTL 和 dedupeKey 合并规则。
 */
export class Outbox {
  private items: OutboxItem[] = []

  constructor(private readonly limit: number) {}
// 相同业务命令合并
// 设置命令过期时间
// 控制队列最大容量Outbox 
// 用于保存离线期间允许延迟发送的命令。入队时通过 dedupeKey
//  合并只关心最终状态的操作，通过 TTL 防止过期操作在重连后执行，
// 并设置容量上限防止长期离线造成内存无限增长。队列溢出时采用先进先出策略淘汰最旧命令。
  enqueue(command: ClientCommand, options: CommandOptions, pending?: PendingCommand): OutboxEnqueueResult {
    let replaced: OutboxItem | undefined
    if (options.dedupeKey) {
      const index = this.items.findIndex(item => item.options.dedupeKey === options.dedupeKey)
      if (index >= 0) replaced = this.items.splice(index, 1)[0]
    }

    this.items.push({
      command,
      options,
      expiresAt: Date.now() + (options.ttlMs ?? 30_000),
      pending
    })

    const dropped = this.items.length > this.limit ? this.items.shift() : undefined
    return {dropped, replaced}
  }

  takeAll() {
    return this.items.splice(0)
  }

  get size() {
    return this.items.length
  }
}
