import type {ClientCommand, CommandAck} from '../protocol'
import type {CommandOptions, CommandResult, PendingCommand} from '../types'

/**
 * 管理“已经发送，但尚未收到 command_ack”的命令。
 */
export class PendingCommands {
  private commands = new Map<string, PendingCommand>()

  constructor(
    private readonly timeoutMs: number,
    private readonly send: (command: ClientCommand) => boolean,
    private readonly onChange: () => void
  ) {}

  dispatch(command: ClientCommand, options: CommandOptions, existing?: PendingCommand) {
    if (existing) {
      this.arm(existing)
      return Promise.resolve<CommandResult>({})
    }

    return new Promise<CommandResult>((resolve, reject) => {
      this.arm({command, options, resolve, reject, timer: null})
    })
  }

  resolve(message: CommandAck) {
    const pending = this.commands.get(message.clientMsgId)
    if (!pending) return
    if (pending.timer) clearTimeout(pending.timer)
    this.commands.delete(message.clientMsgId)
    message.success
      ? pending.resolve({ack: message})
      : pending.reject(new Error(message.error || '命令执行失败'))
    this.onChange()
  }

  drain(error: Error, shouldRetry: (pending: PendingCommand) => boolean) {
    const retryable: PendingCommand[] = []
    for (const pending of this.commands.values()) {
      if (pending.timer) clearTimeout(pending.timer)
      if (shouldRetry(pending)) retryable.push(pending)
      else pending.reject(error)
    }
    this.commands.clear()
    this.onChange()
    return retryable
  }

  get size() {
    return this.commands.size
  }

  private arm(pending: PendingCommand) {
    const {command} = pending
    pending.timer = setTimeout(() => {
      this.commands.delete(command.clientMsgId)
      pending.reject(new Error(`命令确认超时：${command.type}`))
      this.onChange()
    }, this.timeoutMs)

    this.commands.set(command.clientMsgId, pending)
    if (!this.send(command)) {
      clearTimeout(pending.timer)
      this.commands.delete(command.clientMsgId)
      pending.reject(new Error('WebSocket 发送失败'))
    }
    this.onChange()
  }
}
