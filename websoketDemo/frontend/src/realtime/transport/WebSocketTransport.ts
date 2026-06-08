export interface TransportHandlers {
  open: () => void
  message: (raw: unknown) => void
  error: () => void
  close: (event: CloseEvent) => void
}

/**
 * 传输层只包装浏览器原生 WebSocket。
 * 它不知道课堂、ACK、Outbox 或消息恢复，方便未来替换为 Pomelo/Socket.IO 适配器。
 */
export class WebSocketTransport {
  private socket: WebSocket | null = null

  constructor(private readonly createSocket: (url: string) => WebSocket = url => new WebSocket(url)) {}

  connect(url: string, handlers: TransportHandlers) {
    this.close(1000, 'replace transport')
    const socket = this.createSocket(url)
    this.socket = socket

    socket.addEventListener('open', handlers.open)
    socket.addEventListener('message', event => handlers.message(event.data))
    socket.addEventListener('error', handlers.error)
    socket.addEventListener('close', handlers.close)
  }

  send(message: unknown) {
    if (this.socket?.readyState !== WebSocket.OPEN) return false
    this.socket.send(JSON.stringify(message))
    return true
  }

  close(code = 1000, reason = 'close') {
    if (!this.socket) return
    this.socket.close(code, reason)
    this.socket = null
  }

  isOpen() {
    return this.socket?.readyState === WebSocket.OPEN
  }
}
