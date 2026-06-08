import {ConnectionState} from './connection/ConnectionState'
import {
  type BusinessEvent,
  type ConnectionMetrics,
  type KickedMessage,
  type RealtimeLog,
  type SnapshotMessage,
  parseServerMessage
} from './protocol'
import {MessageDeduplicator} from './reliability/MessageDeduplicator'
import {Outbox} from './reliability/Outbox'
import {PendingCommands} from './reliability/PendingCommands'
import {RecoveryManager} from './recovery/RecoveryManager'
import {WebSocketTransport} from './transport/WebSocketTransport'
import {TypedEventBus} from './TypedEventBus'
import type {
  CommandOptions,
  CommandResult,
  PendingCommand,
  WebSocketManagerOptions
} from './types'

interface ManagerEvents<TSnapshot> {
  state: ConnectionMetrics
  metrics: ConnectionMetrics
  log: RealtimeLog
  snapshot: SnapshotMessage<TSnapshot>
  business_event: BusinessEvent
  kicked: KickedMessage
  recovery_complete: {snapshotVersion: number; discardedEvents: number}
}

export type {CommandOptions, CommandResult, WebSocketManagerOptions} from './types'

/**
 * 对业务暴露的门面和流程编排层。
 * 具体能力分别委托给 transport、connection、reliability、recovery 模块。
 */
export class WebSocketManager<TSnapshot = unknown> extends TypedEventBus<ManagerEvents<TSnapshot>> {
  private readonly options: Required<Omit<WebSocketManagerOptions, 'tokenProvider' | 'createSocket'>>
    & Pick<WebSocketManagerOptions, 'tokenProvider' | 'createSocket'>

  private readonly connection = new ConnectionState()
  private readonly transport: WebSocketTransport
  private readonly deduplicator: MessageDeduplicator
  private readonly pending: PendingCommands
  private readonly outbox: Outbox
  private readonly recovery: RecoveryManager
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private heartbeatDeadlineTimer: ReturnType<typeof setTimeout> | null = null

  constructor(options: WebSocketManagerOptions) {
    super()
    this.options = {
      channel: 'main',
      baseReconnectDelay: 800,
      maxReconnectDelay: 15_000,
      maxReconnectAttempts: Number.POSITIVE_INFINITY,
      commandTimeout: 5_000,
      heartbeatInterval: 5_000,
      heartbeatTimeout: 10_000,
      outboxLimit: 100,
      processedMessageTtl: 5 * 60_000,
      ...options
    }
    this.transport = new WebSocketTransport(this.options.createSocket)
    this.deduplicator = new MessageDeduplicator(this.options.processedMessageTtl)
    this.outbox = new Outbox(this.options.outboxLimit)
    this.recovery = new RecoveryManager(
      `websocket:${this.options.liveId}:${this.options.channel}:lastSeq`
    )
    this.pending = new PendingCommands(
      this.options.commandTimeout,
      command => this.sendRaw(command),
      () => this.emitMetrics()
    )

    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  async connect() {
    if (!this.connection.canConnect()) {
      if (this.connection.kicked) this.emitLog('warn', '当前连接已被踢，需要重新登录并创建新实例')
      return
    }
    if (!navigator.onLine) {
      this.setStatus('offline')
      return
    }

    const epoch = this.connection.beginConnect()
    this.emitState()

    try {
      const token = await this.options.tokenProvider()
      if (!this.connection.isCurrent(epoch)) return

      const url = new URL(this.options.url)
      url.searchParams.set('token', token)
      this.transport.connect(url.toString(), {
        open: () => this.handleOpen(epoch),
        message: raw => this.handleMessage(epoch, raw),
        error: () => {
          if (this.connection.isCurrent(epoch)) this.setStatus('failed')
        },
        close: event => this.handleClose(epoch, event)
      })
    } catch (error) {
      this.emitLog('error', `获取 Token 或创建连接失败：${this.errorMessage(error)}`)
      this.setStatus('failed')
      this.scheduleReconnect()
    }
  }

  disconnect() {
    this.connection.markManualClose()
    this.clearReconnectTimer()
    this.stopHeartbeat()
    this.drainPending(new Error('WebSocket 已主动断开'), false)
    this.transport.close(1000, 'manual close')
    this.emitState()
  }

  destroy() {
    this.connection.markDestroyed()
    this.clearReconnectTimer()
    this.stopHeartbeat()
    this.drainPending(new Error('WebSocketManager 已销毁'), false)
    this.transport.close(1000, 'destroy')
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    this.clearListeners()
  }

  sendCommand<TPayload>(
    type: string,
    payload: TPayload,
    options: CommandOptions = {}
  ): Promise<CommandResult> {
    const command = {
      kind: 'command' as const,
      channel: this.options.channel,
      liveId: this.options.liveId,
      clientMsgId: crypto.randomUUID(),
      type,
      payload,
      clientTime: Date.now()
    }

    if (this.connection.status !== 'ready') {
      if (!options.queueWhenOffline) {
        return Promise.reject(new Error(`实时通道尚未就绪：${this.connection.status}`))
      }
      this.enqueueOutbox(command, options)
      return Promise.resolve({queued: true})
    }

    return this.pending.dispatch(command, options)
  }

  getMetrics(): ConnectionMetrics {
    return {
      status: this.connection.status,
      clientId: this.connection.clientId,
      reconnectAttempts: this.connection.reconnectAttempts,
      pendingCommands: this.pending.size,
      outboxSize: this.outbox.size,
      bufferedEvents: this.recovery.bufferedCount,
      processedMessages: this.deduplicator.size,
      lastSeq: this.recovery.lastSeq,
      latency: this.connection.latency
    }
  }

  private handleOpen(epoch: number) {
    if (!this.connection.isCurrent(epoch)) return
    this.setStatus('recovering')
    this.startHeartbeat()
    this.requestRecovery()
  }

  private handleMessage(epoch: number, raw: unknown) {
    if (!this.connection.isCurrent(epoch)) return
    const message = parseServerMessage(raw)
    if (!message) {
      this.emitLog('error', '收到无法识别的服务端消息')
      return
    }

    switch (message.kind) {
      case 'welcome':
        this.connection.clientId = message.clientId
        this.emitMetrics()
        break
      case 'pong':
        this.connection.latency = Date.now() - message.requestTime
        this.clearHeartbeatDeadline()
        this.emitMetrics()
        break
      case 'snapshot':
        this.completeRecovery(message as SnapshotMessage<TSnapshot>)
        break
      case 'event':
        this.receiveEvent(message)
        break
      case 'command_ack':
        this.pending.resolve(message)
        break
      case 'delivery_failed':
        this.emitLog('error', `服务端消息投递失败：${message.type}`, {
          msgId: message.msgId,
          attempts: message.attempts
        })
        break
      case 'kicked':
        this.connection.kicked = true
        this.setStatus('kicked')
        this.emit('kicked', message)
        break
      case 'error':
        this.emitLog('error', `${message.code}: ${message.message}`)
        break
    }
  }

  private receiveEvent(message: BusinessEvent) {
    this.sendRaw({
      kind: 'ack',
      liveId: this.options.liveId,
      msgId: message.msgId,
      seq: message.seq,
      clientTime: Date.now()
    })

    if (this.deduplicator.has(message.msgId)) {
      this.emitLog('warn', `msgId 去重：${message.type}`, {
        msgId: message.msgId,
        deliveryAttempt: message.deliveryAttempt
      })
      return
    }
    this.deduplicator.add(message.msgId)

    if (this.connection.status === 'recovering') {
      this.recovery.bufferEvent(message)
      this.emitMetrics()
      return
    }
    this.applyOrderedEvent(message)
  }

  private applyOrderedEvent(message: BusinessEvent) {
    const order = this.recovery.classify(message)
    if (order === 'old') {
      this.emitLog('warn', `seq 防旧：收到 ${message.seq}，本地为 ${this.recovery.lastSeq}`)
      return
    }
    if (order === 'gap') {
      this.emitLog('warn', `检测到消息缺口：期望 ${this.recovery.lastSeq + 1}，实际 ${message.seq}`)
      this.recovery.bufferEvent(message)
      this.setStatus('recovering')
      this.requestRecovery()
      return
    }

    this.recovery.commit(message.seq)
    this.emit('business_event', message)
    this.emitMetrics()
  }

  private completeRecovery(snapshot: SnapshotMessage<TSnapshot>) {
    const snapshotVersion = snapshot.payload.version
    this.emit('snapshot', snapshot)
    const result = this.recovery.complete(snapshotVersion)

    for (const event of result.toApply) this.applyOrderedEvent(event)

    this.connection.reconnectAttempts = 0
    this.setStatus('ready')
    this.emit('recovery_complete', {
      snapshotVersion,
      discardedEvents: result.discardedEvents
    })
    this.flushOutbox()
  }

  private requestRecovery() {
    this.sendRaw({
      kind: 'subscribe',
      channel: this.options.channel,
      liveId: this.options.liveId,
      lastSeq: this.recovery.lastSeq
    })
  }

  private enqueueOutbox(
    command: Parameters<PendingCommands['dispatch']>[0],
    options: CommandOptions,
    pending?: PendingCommand
  ) {
    const {dropped, replaced} = this.outbox.enqueue(command, options, pending)
    dropped?.pending?.reject(new Error(`Outbox 超出容量：${dropped.command.type}`))
    replaced?.pending?.reject(new Error(`Outbox 命令被更新操作替代：${replaced.command.type}`))
    this.emitLog('warn', `命令进入 Outbox：${command.type}`)
    this.emitMetrics()
  }

  private flushOutbox() {
    const now = Date.now()
    const queued = this.outbox.takeAll()
    this.emitMetrics()

    for (const item of queued) {
      if (item.expiresAt <= now) {
        item.pending?.reject(new Error(`Outbox 命令已过期：${item.command.type}`))
        this.emitLog('warn', `丢弃过期 Outbox 命令：${item.command.type}`)
        continue
      }
      this.pending.dispatch(item.command, item.options, item.pending)
        .then(() => this.emitLog('info', `Outbox 命令发送成功：${item.command.type}`))
        .catch(error => this.emitLog('error', this.errorMessage(error)))
    }
  }

  private drainPending(error: Error, allowRetry: boolean) {
    const retryable = this.pending.drain(
      error,
      pending => allowRetry && Boolean(pending.options.retryOnReconnect)
    )
    for (const pending of retryable) {
      this.enqueueOutbox(pending.command, pending.options, pending)
    }
  }

  private handleClose(epoch: number, event: CloseEvent) {
    if (!this.connection.isCurrent(epoch)) return
    this.stopHeartbeat()
    // WebSocket 异常断开后，清理所有正在等待 ACK 的命令，并允许其中配置了重连重试的命令进入 Outbox。
    this.drainPending(new Error(`连接已断开：${event.code}`), true)

    if (this.connection.kicked || event.code === 4003) {
      this.setStatus('kicked')
      return
    }
    if (this.connection.destroyed || this.connection.manuallyClosed || event.code === 1000) {
      this.setStatus('closed')
      return
    }
    if (!navigator.onLine) {
      this.setStatus('offline')
      return
    }

    this.setStatus('failed')
    this.scheduleReconnect()
  }

  private scheduleReconnect() {
    if (this.connection.destroyed || this.connection.kicked || this.reconnectTimer || !navigator.onLine) return
    if (this.connection.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.emitLog('error', '已达到最大重连次数')
      return
    }

    this.connection.reconnectAttempts += 1
    const exponential = Math.min(
      this.options.baseReconnectDelay * 2 ** (this.connection.reconnectAttempts - 1),
      this.options.maxReconnectDelay
    )
    const delay = exponential + Math.round(Math.random() * Math.min(1000, exponential * 0.3))
    this.emitLog('warn', `第 ${this.connection.reconnectAttempts} 次重连将在 ${delay}ms 后执行`)
    this.emitMetrics()

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      void this.connect()
    }, delay)
  }

  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.options.heartbeatInterval)
    this.sendHeartbeat()
  }

  private sendHeartbeat() {
    if (this.heartbeatDeadlineTimer) return
    if (!this.sendRaw({kind: 'ping', clientTime: Date.now()})) return
    this.heartbeatDeadlineTimer = setTimeout(() => {
      this.emitLog('error', '心跳响应超时，主动关闭假连接')
      this.transport.close(4000, 'heartbeat timeout')
    }, this.options.heartbeatTimeout)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = null
    this.clearHeartbeatDeadline()
  }

  private clearHeartbeatDeadline() {
    if (this.heartbeatDeadlineTimer) clearTimeout(this.heartbeatDeadlineTimer)
    this.heartbeatDeadlineTimer = null
  }

  private sendRaw(message: unknown) {
    try {
      return this.transport.send(message)
    } catch (error) {
      this.emitLog('error', `WebSocket 发送异常：${this.errorMessage(error)}`)
      return false
    }
  }

  private setStatus(status: ConnectionMetrics['status']) {
    this.connection.status = status
    this.emitState()
  }

  private emitState() {
    this.emit('state', this.getMetrics())
  }

  private emitMetrics() {
    this.emit('metrics', this.getMetrics())
  }

  private emitLog(level: RealtimeLog['level'], text: string, context?: Record<string, unknown>) {
    this.emit('log', {level, text, context})
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
  }

  private errorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error)
  }

  private readonly handleOnline = () => {
    this.emitLog('info', '浏览器网络恢复')
    if (
      !this.connection.destroyed
      && !this.connection.manuallyClosed
      && !this.connection.kicked
      && this.connection.status !== 'ready'
    ) {
      void this.connect()
    }
  }

  private readonly handleOffline = () => {
    this.emitLog('warn', '浏览器网络离线')
    this.clearReconnectTimer()
    this.setStatus('offline')
    this.transport.close(4000, 'browser offline')
  }

  private readonly handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && this.connection.status === 'ready') {
      this.sendHeartbeat()
    }
  }
}
