import {randomUUID} from 'node:crypto'
import {WebSocket} from 'ws'
import {SubscriptionManager} from './subscriptionManager.js'

const ACK_TIMEOUT_MS = 1500
const MAX_DELIVERY_ATTEMPTS = 3
const MAX_HISTORY = 500

export class ReliableBroker {
  constructor() {
    this.clients = new Map()
    this.history = new Map()
    this.roomSeq = new Map()
    this.subscriptions = new SubscriptionManager()
  }

  register(ws, session) {
    this.clients.set(session.clientId, {
      ws,
      session,
      pendingAcks: new Map(),
      dropNextAck: false
    })
  }

  unregister(clientId) {
    const client = this.clients.get(clientId)
    if (!client) return
    for (const pending of client.pendingAcks.values()) {
      clearTimeout(pending.timer)
    }
    this.subscriptions.removeClient(clientId)
    this.clients.delete(clientId)
  }

  subscribe(clientId, subscription) {
    const client = this.clients.get(clientId)
    if (!client) return null
    const normalized = this.subscriptions.subscribe(clientId, subscription)
    client.session.liveId = normalized.liveId
    client.session.channel = normalized.channel
    return normalized
  }

  unsubscribe(clientId, subscription) {
    return this.subscriptions.unsubscribe(clientId, subscription)
  }

  hasSubscription(clientId, subscription) {
    return this.subscriptions.hasSubscription(clientId, subscription)
  }

  publish(liveId, event, options = {}) {
    const channel = options.channel || 'main'
    const envelope = {
      kind: 'event',
      channel,
      liveId,
      seq: this.nextSeq(liveId),
      msgId: randomUUID(),
      type: event.type,
      version: event.version,
      payload: event.payload,
      serverTime: Date.now()
    }

    const history = this.history.get(liveId) || []
    history.push(envelope)
    if (history.length > MAX_HISTORY) history.shift()
    this.history.set(liveId, history)

    const subscriberIds = this.subscriptions.getSubscribers({
      liveId,
      channel,
      topic: event.type
    })

    for (const clientId of subscriberIds) {
      if (options.excludeClientId === clientId) continue
      const client = this.clients.get(clientId)
      if (!client) continue
      this.deliver(client, envelope)
    }

    return envelope
  }

  recover(clientId, liveId, lastSeq) {
    const client = this.clients.get(clientId)
    if (!client) return []
    const missed = (this.history.get(liveId) || []).filter(message => {
      if (message.seq <= lastSeq) return false
      return this.subscriptions.hasSubscription(clientId, {
        liveId,
        channel: message.channel || client.session.channel || 'main',
        topics: [message.type]
      })
    })
    for (const message of missed) {
      this.deliver(client, {...message, recovered: true})
    }
    return missed
  }

  acknowledge(clientId, msgId) {
    const client = this.clients.get(clientId)
    const pending = client?.pendingAcks.get(msgId)
    if (!pending) return false

    if (client.dropNextAck) {
      client.dropNextAck = false
      return false
    }

    clearTimeout(pending.timer)
    client.pendingAcks.delete(msgId)
    return true
  }

  dropNextAck(clientId) {
    const client = this.clients.get(clientId)
    if (client) client.dropNextAck = true
  }

  deliverDuplicate(clientId) {
    const client = this.clients.get(clientId)
    if (!client) return
    const history = this.history.get(client.session.liveId) || []
    const last = history.at(-1)
    if (last) this.send(client.ws, {...last, duplicateInjected: true})
  }

  deliverOutOfOrder(clientId) {
    const client = this.clients.get(clientId)
    if (!client) return
    const history = this.history.get(client.session.liveId) || []
    const old = history.at(-2)
    if (old) {
      this.send(client.ws, {
        ...old,
        msgId: randomUUID(),
        outOfOrderInjected: true
      })
    }
  }

  deliver(client, message, attempt = 1) {
    if (!this.send(client.ws, {...message, deliveryAttempt: attempt})) return

    const existing = client.pendingAcks.get(message.msgId)
    if (existing) clearTimeout(existing.timer)

    const timer = setTimeout(() => {
      if (!client.pendingAcks.has(message.msgId)) return
      if (attempt >= MAX_DELIVERY_ATTEMPTS) {
        client.pendingAcks.delete(message.msgId)
        this.send(client.ws, {
          kind: 'delivery_failed',
          msgId: message.msgId,
          type: message.type,
          attempts: attempt
        })
        return
      }
      this.deliver(client, message, attempt + 1)
    }, ACK_TIMEOUT_MS)

    client.pendingAcks.set(message.msgId, {timer, attempt})
  }

  send(ws, message) {
    if (ws.readyState !== WebSocket.OPEN) return false
    ws.send(JSON.stringify(message))
    return true
  }

  nextSeq(liveId) {
    const next = (this.roomSeq.get(liveId) || 0) + 1
    this.roomSeq.set(liveId, next)
    return next
  }
}
