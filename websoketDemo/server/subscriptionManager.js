const DEFAULT_CHANNEL = 'main'
const ALL_TOPICS = '*'

function normalizeSubscription(input = {}) {
  const liveId = String(input.liveId || '').trim()
  const channel = String(input.channel || DEFAULT_CHANNEL).trim() || DEFAULT_CHANNEL
  const topics = Array.isArray(input.topics) && input.topics.length
    ? input.topics
    : [ALL_TOPICS]

  return {
    liveId,
    channel,
    topics: Array.from(new Set(
      topics
        .map(topic => String(topic || '').trim())
        .filter(Boolean)
    ))
  }
}

function subscriptionKey(subscription) {
  return `${subscription.liveId}:${subscription.channel}`
}

function topicKey(subscription, topic) {
  return `${subscriptionKey(subscription)}:${topic}`
}

/**
 * Maintains both forward and reverse indexes:
 * - topic index: live/channel/topic -> client ids, for fast fan-out.
 * - client index: client id -> subscriptions, for cleanup and permission checks.
 */
export class SubscriptionManager {
  constructor() {
    this.topicSubscribers = new Map()
    this.clientSubscriptions = new Map()
  }

  subscribe(clientId, input) {
    const subscription = normalizeSubscription(input)
    if (!subscription.liveId) throw new Error('liveId is required')

    const existing = this.clientSubscriptions.get(clientId) || new Map()
    const key = subscriptionKey(subscription)
    const previous = existing.get(key)
    if (previous) this.removeTopics(clientId, previous)

    existing.set(key, subscription)
    this.clientSubscriptions.set(clientId, existing)

    for (const topic of subscription.topics) {
      const key = topicKey(subscription, topic)
      const clients = this.topicSubscribers.get(key) || new Set()
      clients.add(clientId)
      this.topicSubscribers.set(key, clients)
    }

    return subscription
  }

  unsubscribe(clientId, input) {
    const subscription = normalizeSubscription(input)
    const subscriptions = this.clientSubscriptions.get(clientId)
    if (!subscriptions) return false

    const key = subscriptionKey(subscription)
    const previous = subscriptions.get(key)
    if (!previous) return false

    const shouldRemoveAll = subscription.topics.includes(ALL_TOPICS)
    const topicsToRemove = shouldRemoveAll
      ? previous.topics
      : subscription.topics.filter(topic => previous.topics.includes(topic))
    if (!topicsToRemove.length) return false

    this.removeTopics(clientId, {...previous, topics: topicsToRemove})

    const nextTopics = previous.topics.filter(topic => !topicsToRemove.includes(topic))
    if (nextTopics.length) {
      subscriptions.set(key, {...previous, topics: nextTopics})
    } else {
      subscriptions.delete(key)
    }
    if (!subscriptions.size) this.clientSubscriptions.delete(clientId)
    return true
  }

  removeClient(clientId) {
    const subscriptions = this.clientSubscriptions.get(clientId)
    if (!subscriptions) return

    for (const subscription of subscriptions.values()) {
      this.removeTopics(clientId, subscription)
    }
    this.clientSubscriptions.delete(clientId)
  }

  getSubscribers({liveId, channel = DEFAULT_CHANNEL, topic = ALL_TOPICS}) {
    const exact = this.topicSubscribers.get(`${liveId}:${channel}:${topic}`) || new Set()
    const wildcard = this.topicSubscribers.get(`${liveId}:${channel}:${ALL_TOPICS}`) || new Set()
    return new Set([...exact, ...wildcard])
  }

  hasSubscription(clientId, input) {
    const subscription = normalizeSubscription(input)
    const existing = this.clientSubscriptions.get(clientId)?.get(subscriptionKey(subscription))
    if (!existing) return false
    return existing.topics.includes(ALL_TOPICS)
      || subscription.topics.some(topic => existing.topics.includes(topic))
  }

  getClientSubscriptions(clientId) {
    return [...(this.clientSubscriptions.get(clientId)?.values() || [])]
  }

  removeTopics(clientId, subscription) {
    for (const topic of subscription.topics) {
      const key = topicKey(subscription, topic)
      const clients = this.topicSubscribers.get(key)
      if (!clients) continue
      clients.delete(clientId)
      if (!clients.size) this.topicSubscribers.delete(key)
    }
  }
}
