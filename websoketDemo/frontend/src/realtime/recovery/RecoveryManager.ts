import type {BusinessEvent} from '../protocol'

export interface RecoveryResult {
  toApply: BusinessEvent[]
  discardedEvents: number
}

/**
 * 独占 lastSeq、恢复缓冲和本地持久化，保证恢复逻辑只有一个数据源。
 */
export class RecoveryManager {
  private buffer = new Map<number, BusinessEvent>()
  private currentSeq: number

  constructor(private readonly storageKey: string) {
    this.currentSeq = this.readLastSeq()
  }

  get lastSeq() {
    return this.currentSeq
  }

  get bufferedCount() {
    return this.buffer.size
  }

  bufferEvent(event: BusinessEvent) {
    this.buffer.set(event.seq, event)
  }

  classify(event: BusinessEvent): 'old' | 'gap' | 'next' {
    if (event.seq <= this.currentSeq) return 'old'
    if (event.seq !== this.currentSeq + 1) return 'gap'
    return 'next'
  }

  commit(seq: number) {
    this.currentSeq = seq
    try {
      localStorage.setItem(this.storageKey, String(seq))
    } catch {
      // 存储失败不阻断实时消息消费，由上层日志系统负责记录。
    }
  }
// 表示服务端快照已经到达，现在处理恢复缓冲区。
  complete(snapshotVersion: number): RecoveryResult {
    const events = [...this.buffer.values()].sort((a, b) => a.seq - b.seq)
    this.buffer.clear()
    const toApply: BusinessEvent[] = []
    let discardedEvents = 0

    for (const event of events) {
      if (event.version <= snapshotVersion) {
        this.commit(Math.max(this.currentSeq, event.seq))
        discardedEvents += 1
      } else {
        toApply.push(event)
      }
    }

    return {toApply, discardedEvents}
  }

  private readLastSeq() {
    try {
      const value = Number(localStorage.getItem(this.storageKey) || 0)
      return Number.isSafeInteger(value) && value >= 0 ? value : 0
    } catch {
      return 0
    }
  }
}
