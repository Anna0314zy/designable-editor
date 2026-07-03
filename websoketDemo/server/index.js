import http from 'node:http'
import {randomUUID} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {extname, join, resolve} from 'node:path'
import {WebSocketServer, WebSocket} from 'ws'
import {ClassroomAggregate} from './classroom.js'
import {ReliableBroker} from './reliableBroker.js'

const PORT = Number(process.env.PORT || 8787)
const HOST = '127.0.0.1'
const LIVE_ID = 'demo-live-001'
const DIST_DIR = resolve(new URL('../dist', import.meta.url).pathname)
const DEMO_TOKEN = 'teacher-demo-token'
const MAIN_CHANNEL = 'main'
const broker = new ReliableBroker()
const classroom = new ClassroomAggregate(LIVE_ID)
const processedCommands = new Map()

const mimeMap = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml'
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)

    if (url.pathname === '/api/snapshot') {
      res.writeHead(200, {'content-type': 'application/json; charset=utf-8'})
      res.end(JSON.stringify(classroom.snapshot()))
      return
    }

    const pathname = url.pathname === '/' ? '/index.html' : url.pathname
    const filePath = join(DIST_DIR, pathname)
    const content = await readFile(filePath)
    res.writeHead(200, {'content-type': mimeMap[extname(filePath)] || 'application/octet-stream'})
    res.end(content)
  } catch {
    try {
      const content = await readFile(join(DIST_DIR, 'index.html'))
      res.writeHead(200, {'content-type': 'text/html; charset=utf-8'})
      res.end(content)
    } catch {
      res.writeHead(503, {'content-type': 'text/plain; charset=utf-8'})
      res.end('Run pnpm build first')
    }
  }
})

const wss = new WebSocketServer({
  noServer: true,
  maxPayload: 64 * 1024
})

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const token = url.searchParams.get('token')

  if (url.pathname !== '/ws' || token !== DEMO_TOKEN) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }

  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req)
  })
})

wss.on('connection', ws => {
  const session = {
    clientId: randomUUID(),
    liveId: '',
    channel: MAIN_CHANNEL,
    alive: true
  }
  broker.register(ws, session)

  ws.on('pong', () => {
    session.alive = true
  })

  ws.on('message', raw => {
    let message
    try {
      message = JSON.parse(raw.toString())
    } catch {
      send(ws, {kind: 'error', code: 'INVALID_JSON', message: '消息不是合法 JSON'})
      return
    }
    handleMessage(ws, session, message)
  })

  ws.on('close', () => broker.unregister(session.clientId))
  ws.on('error', () => broker.unregister(session.clientId))

  send(ws, {
    kind: 'welcome',
    clientId: session.clientId,
    heartbeatInterval: 5000,
    ackTimeout: 1500,
    serverTime: Date.now()
  })
})

function handleMessage(ws, session, message) {
  if (message.kind === 'subscribe') {
    if (message.liveId !== LIVE_ID) {
      send(ws, {kind: 'error', code: 'LIVE_NOT_FOUND', message: '课堂不存在'})
      return
    }
    broker.subscribe(session.clientId, {
      liveId: message.liveId,
      channel: message.channel || MAIN_CHANNEL,
      topics: message.topics
    })
    const recovered = broker.recover(
      session.clientId,
      message.liveId,
      Number(message.lastSeq || 0)
    )
    sendSnapshot(ws, recovered.length ? 'after-recovery' : 'initial-subscribe')
    return
  }

  if (message.kind === 'unsubscribe') {
    broker.unsubscribe(session.clientId, {
      liveId: message.liveId || session.liveId,
      channel: message.channel || session.channel || MAIN_CHANNEL,
      topics: message.topics
    })
    return
  }

  if (message.kind === 'ack') {
    broker.acknowledge(session.clientId, message.msgId)
    return
  }

  if (message.kind === 'ping') {
    send(ws, {kind: 'pong', requestTime: message.clientTime, serverTime: Date.now()})
    return
  }

  if (message.kind !== 'command') return

  if (!broker.hasSubscription(session.clientId, {
    liveId: message.liveId,
    channel: message.channel || MAIN_CHANNEL,
    topics: [message.type]
  })) {
    sendCommandAck(ws, message, false, 'LIVE_ID_MISMATCH')
    return
  }

  if (processedCommands.has(message.clientMsgId)) {
    send(ws, processedCommands.get(message.clientMsgId))
    return
  }

  try {
    if (message.type.startsWith('chaos.')) {
      handleChaos(ws, session, message)
      return
    }

    const event = classroom.execute(message.type, message.payload)
    broker.publish(session.liveId, event)
    const ack = sendCommandAck(ws, message, true)
    processedCommands.set(message.clientMsgId, ack)
    trimProcessedCommands()
  } catch (error) {
    sendCommandAck(ws, message, false, error.message)
  }
}

function handleChaos(ws, session, message) {
  sendCommandAck(ws, message, true)

  if (message.type === 'chaos.disconnect') {
    ws.close(4001, 'simulated network interruption')
    return
  }

  if (message.type === 'chaos.disconnectThenMutate') {
    ws.close(4001, 'disconnect before offline events')
    setTimeout(() => {
      broker.publish(LIVE_ID, classroom.execute('student.setHandUp', {
        stuId: 'stu_003',
        isHandUp: true
      }))
      broker.publish(LIVE_ID, classroom.execute('courseware.setPage', {
        page: classroom.currentPage + 1
      }))
    }, 400)
    return
  }

  if (message.type === 'chaos.duplicate') {
    broker.deliverDuplicate(session.clientId)
    return
  }

  if (message.type === 'chaos.outOfOrder') {
    broker.deliverOutOfOrder(session.clientId)
    return
  }

  if (message.type === 'chaos.dropNextAck') {
    broker.dropNextAck(session.clientId)
    return
  }

  if (message.type === 'chaos.kick') {
    send(ws, {
      kind: 'kicked',
      code: 'LOGIN_CONFLICT',
      message: '同一账号在其他设备进入课堂'
    })
    ws.close(4003, 'login conflict')
  }
}

function sendSnapshot(ws, reason) {
  send(ws, {
    kind: 'snapshot',
    reason,
    payload: classroom.snapshot(),
    serverTime: Date.now()
  })
}

function sendCommandAck(ws, command, success, error = '') {
  const ack = {
    kind: 'command_ack',
    clientMsgId: command.clientMsgId,
    success,
    error,
    serverTime: Date.now()
  }
  send(ws, ack)
  return ack
}

function send(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  }
}

function trimProcessedCommands() {
  if (processedCommands.size <= 1000) return
  const first = processedCommands.keys().next().value
  processedCommands.delete(first)
}

const heartbeatTimer = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.readyState !== WebSocket.OPEN) continue
    const session = [...broker.clients.values()].find(item => item.ws === ws)?.session
    if (session && !session.alive) {
      ws.terminate()
      continue
    }
    if (session) session.alive = false
    ws.ping()
  }
}, 5000)

server.on('close', () => clearInterval(heartbeatTimer))

server.listen(PORT, HOST, () => {
  console.log(`production-style WebSocket demo: http://${HOST}:${PORT}`)
})
