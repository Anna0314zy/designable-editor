type Handler<T> = (payload: T) => void

export class TypedEventBus<TEvents extends object> {
  private listeners = new Map<keyof TEvents, Set<Handler<TEvents[keyof TEvents]>>>()

  on<TKey extends keyof TEvents>(type: TKey, handler: Handler<TEvents[TKey]>) {
    const handlers = this.listeners.get(type) || new Set()
    handlers.add(handler as Handler<TEvents[keyof TEvents]>)
    this.listeners.set(type, handlers)
    return () => this.off(type, handler)
  }

  off<TKey extends keyof TEvents>(type: TKey, handler: Handler<TEvents[TKey]>) {
    this.listeners.get(type)?.delete(handler as Handler<TEvents[keyof TEvents]>)
  }

  protected emit<TKey extends keyof TEvents>(type: TKey, payload: TEvents[TKey]) {
    this.listeners.get(type)?.forEach(handler => handler(payload))
  }

  protected clearListeners() {
    this.listeners.clear()
  }
}
