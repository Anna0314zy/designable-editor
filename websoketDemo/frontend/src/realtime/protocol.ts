import {
  parseBusinessEvent,
  type BusinessEvent
} from './businessEvents'

export type {
  BusinessEvent,
  CoursewarePageChangedEvent,
  InteractionAnsweredEvent,
  StageChangedEvent,
  StudentHandUpChangedEvent,
  StudentScoreChangedEvent
} from './businessEvents'

export type ConnectionStatus =
  | 'idle'
  | 'offline'
  | 'connecting'
  | 'recovering'
  | 'ready'
  | 'reconnecting'
  | 'failed'
  | 'closed'
  | 'kicked'

export interface WelcomeMessage {
  kind: 'welcome'
  clientId: string
  heartbeatInterval: number
  ackTimeout: number
  serverTime: number
}

export interface SnapshotMessage<TSnapshot = unknown> {
  kind: 'snapshot'
  reason: string
  payload: TSnapshot & {version: number}
  serverTime: number
}

export interface CommandAck {
  kind: 'command_ack'
  clientMsgId: string
  success: boolean
  error?: string
  serverTime: number
}

export interface PongMessage {
  kind: 'pong'
  requestTime: number
  serverTime: number
}

export interface KickedMessage {
  kind: 'kicked'
  code: string
  message: string
}

export interface ErrorMessage {
  kind: 'error'
  code: string
  message: string
}

export interface DeliveryFailedMessage {
  kind: 'delivery_failed'
  msgId: string
  type: string
  attempts: number
}

export type ServerMessage<TSnapshot = unknown> =
  | WelcomeMessage
  | SnapshotMessage<TSnapshot>
  | BusinessEvent
  | CommandAck
  | PongMessage
  | KickedMessage
  | ErrorMessage
  | DeliveryFailedMessage

export interface ClientCommand<TPayload = unknown> {
  kind: 'command'
  channel: string
  liveId: string
  clientMsgId: string
  type: string
  payload: TPayload
  clientTime: number
}

export interface ConnectionMetrics {
  status: ConnectionStatus
  clientId: string
  reconnectAttempts: number
  pendingCommands: number
  outboxSize: number
  bufferedEvents: number
  processedMessages: number
  lastSeq: number
  latency: number
}

export interface RealtimeLog {
  level: 'info' | 'warn' | 'error'
  text: string
  context?: Record<string, unknown>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export function parseServerMessage(raw: unknown): ServerMessage | null {
  if (typeof raw !== 'string') return null

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return null
  }

  if (!isRecord(value) || typeof value.kind !== 'string') return null

  switch (value.kind) {
    case 'welcome':
      return typeof value.clientId === 'string' ? value as unknown as WelcomeMessage : null
    case 'snapshot':
      return isRecord(value.payload) && typeof value.payload.version === 'number'
        ? value as unknown as SnapshotMessage
        : null
    case 'event':
      return parseBusinessEvent(value)
    case 'command_ack':
      return typeof value.clientMsgId === 'string' && typeof value.success === 'boolean'
        ? value as unknown as CommandAck
        : null
    case 'pong':
      return typeof value.requestTime === 'number' ? value as unknown as PongMessage : null
    case 'kicked':
      return typeof value.message === 'string' ? value as unknown as KickedMessage : null
    case 'error':
      return typeof value.code === 'string' ? value as unknown as ErrorMessage : null
    case 'delivery_failed':
      return typeof value.msgId === 'string' ? value as unknown as DeliveryFailedMessage : null
    default:
      return null
  }
}
