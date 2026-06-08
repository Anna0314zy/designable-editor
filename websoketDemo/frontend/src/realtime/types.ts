import type {ClientCommand, CommandAck} from './protocol'

export interface CommandOptions {
  queueWhenOffline?: boolean
  retryOnReconnect?: boolean
  ttlMs?: number
  dedupeKey?: string
}

export interface CommandResult {
  queued?: boolean
  ack?: CommandAck
}

export interface PendingCommand {
  command: ClientCommand
  options: CommandOptions
  resolve: (value: CommandResult) => void
  reject: (reason: Error) => void
  timer: ReturnType<typeof setTimeout> | null
}

export interface OutboxItem {
  command: ClientCommand
  options: CommandOptions
  expiresAt: number
  pending?: PendingCommand
}

export interface WebSocketManagerOptions {
  url: string
  liveId: string
  tokenProvider: () => string | Promise<string>
  channel?: string
  baseReconnectDelay?: number
  maxReconnectDelay?: number
  maxReconnectAttempts?: number
  commandTimeout?: number
  heartbeatInterval?: number
  heartbeatTimeout?: number
  outboxLimit?: number
  processedMessageTtl?: number
  createSocket?: (url: string) => WebSocket
}
