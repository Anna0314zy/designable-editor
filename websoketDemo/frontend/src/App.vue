<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, reactive, ref} from 'vue'
import {WebSocketManager} from './realtime'
import {
  applyBusinessEvent,
  applySnapshot,
  classroomStore,
  type ClassroomSnapshot
} from './business/classroomStore'
import type {
  CommandOptions,
  CommandResult,
  ConnectionMetrics,
  RealtimeLog
} from './realtime'

const LIVE_ID = 'demo-live-001'
interface UiLog {
  id: string
  time: string
  level: RealtimeLog['level']
  text: string
}

const logs = ref<UiLog[]>([])
const metrics = reactive<ConnectionMetrics>({
  status: 'idle',
  clientId: '',
  reconnectAttempts: 0,
  pendingCommands: 0,
  outboxSize: 0,
  bufferedEvents: 0,
  processedMessages: 0,
  lastSeq: 0,
  latency: 0
})

const manager = new WebSocketManager<ClassroomSnapshot>({
  url: `ws://${location.host}/ws`,
  tokenProvider: async () => 'teacher-demo-token',
  liveId: LIVE_ID,
  maxReconnectAttempts: 10
})

const students = computed(() => Object.values(classroomStore.students))

const log = (text: string, level: RealtimeLog['level'] = 'info') => {
  logs.value.unshift({
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString(),
    level,
    text
  })
  logs.value = logs.value.slice(0, 120)
}

const syncMetrics = (value: ConnectionMetrics) => Object.assign(metrics, value)

const send = async (
  type: string,
  payload: Record<string, unknown> = {},
  options: CommandOptions = {}
) => {
  try {
    const result: CommandResult = await manager.sendCommand(type, payload, options)
    log(result?.queued ? `已进入 outbox：${type}` : `命令确认成功：${type}`)
  } catch (error) {
    log(error instanceof Error ? error.message : String(error), 'error')
  }
}

const disposers = [
  manager.on('state', syncMetrics),
  manager.on('metrics', syncMetrics),
  manager.on('log', (item: RealtimeLog) => log(item.text, item.level)),
  manager.on('snapshot', message => {
    const applied = applySnapshot(message)
    log(applied
      ? `应用服务端快照：${message.reason}，version=${message.payload.version}`
      : `忽略过期快照：version=${message.payload.version}`
    )
  }),
  manager.on('business_event', event => {
    const result = applyBusinessEvent(event)
    if (result.applied) {
      log(`${event.recovered ? '恢复消息' : '实时消息'}：${event.type}，seq=${event.seq}`)
    } else {
      log(result.reason || '业务事件未应用', 'warn')
    }
  }),
  manager.on('kicked', message => log(`被踢下线：${message.message}`, 'error')),
  manager.on('recovery_complete', result => {
    log(`恢复完成：快照版本 ${result.snapshotVersion}，快照覆盖 ${result.discardedEvents} 条增量`)
  })
]

onMounted(() => {
  void manager.connect()
})
onBeforeUnmount(() => {
  disposers.forEach(dispose => dispose())
  manager.destroy()
})
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div>
        <div class="eyebrow">TEACHER REALTIME LAB</div>
        <h1>授课端 WebSocket 生产化实验场</h1>
      </div>
      <div class="connection">
        <span class="status-dot" :class="metrics.status"></span>
        <strong>{{ metrics.status }}</strong>
        <span>{{ metrics.latency }}ms</span>
      </div>
    </header>

    <nav class="toolbar">
      <button @click="manager.connect()">连接</button>
      <button @click="manager.disconnect()">主动断开</button>
      <button @click="send('chaos.disconnect')">模拟瞬断</button>
      <button @click="send('chaos.disconnectThenMutate')">断线期间发生事件</button>
      <button @click="send('chaos.duplicate')">重复消息</button>
      <button @click="send('chaos.outOfOrder')">旧消息乱序到达</button>
      <button @click="send('chaos.dropNextAck')">丢一次 ACK</button>
      <button class="danger" @click="send('chaos.kick')">模拟互踢</button>
    </nav>

    <section class="metrics-strip">
      <div><span>Client</span><strong>{{ metrics.clientId.slice(0, 8) || '-' }}</strong></div>
      <div><span>Last Seq</span><strong>{{ metrics.lastSeq }}</strong></div>
      <div><span>业务版本</span><strong>{{ classroomStore.version }}</strong></div>
      <div><span>重连次数</span><strong>{{ metrics.reconnectAttempts }}</strong></div>
      <div><span>Pending</span><strong>{{ metrics.pendingCommands }}</strong></div>
      <div><span>Outbox</span><strong>{{ metrics.outboxSize }}</strong></div>
      <div><span>恢复缓冲</span><strong>{{ metrics.bufferedEvents }}</strong></div>
    </section>

    <section class="workspace">
      <div class="main-column">
        <section class="section">
          <div class="section-title">
            <h2>学生实时状态</h2>
            <span>当前课件第 {{ classroomStore.currentPage }} 页</span>
          </div>
          <div class="student-table">
            <div class="table-row table-head">
              <span>学生</span><span>举手</span><span>上台</span><span>答案</span><span>积分</span>
            </div>
            <div v-for="student in students" :key="student.id" class="table-row">
              <strong>{{ student.name }}</strong>
              <span :class="{active: student.isHandUp}">{{ student.isHandUp ? '是' : '否' }}</span>
              <span :class="{active: classroomStore.stageStudents.includes(student.id)}">
                {{ classroomStore.stageStudents.includes(student.id) ? '是' : '否' }}
              </span>
              <span>{{ classroomStore.interaction.answers[student.id] || '-' }}</span>
              <span>{{ student.score }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-title">
            <h2>课堂业务操作</h2>
            <span>命令先由服务端确认，再由下行事件更新 Store</span>
          </div>
          <div class="action-groups">
            <div>
              <h3>学生状态</h3>
              <button @click="send('student.setHandUp', {stuId: 'stu_001', isHandUp: true})">小乐举手</button>
              <button @click="send('student.setHandUp', {stuId: 'stu_001', isHandUp: false})">取消举手</button>
              <button @click="send('stage.set', {stuId: 'stu_002', onStage: true})">小读上台</button>
              <button @click="send('stage.set', {stuId: 'stu_002', onStage: false})">小读下台</button>
            </div>
            <div>
              <h3>课件与互动</h3>
              <button @click="send('courseware.setPage', {page: classroomStore.currentPage + 1})">课件下一页</button>
              <button @click="send('interaction.answer', {stuId: 'stu_003', answer: 'B'})">小课回答 B</button>
              <button @click="send('student.reward', {stuId: 'stu_003', points: 2})">小课奖励 2 分</button>
            </div>
            <div>
              <h3>离线发送策略</h3>
              <button @click="send('courseware.setPage', {page: classroomStore.currentPage + 1}, {queueWhenOffline: true})">
                离线时进入 Outbox
              </button>
            </div>
          </div>
        </section>
      </div>

      <aside class="side-column">
        <section class="section log-section">
          <div class="section-title">
            <h2>链路日志</h2>
            <button class="icon-button" title="清空日志" @click="logs = []">清空</button>
          </div>
          <div class="logs">
            <div v-for="item in logs" :key="item.id" class="log-line" :class="item.level">
              <time>{{ item.time }}</time>
              <span>{{ item.text }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-title"><h2>业务 Store</h2></div>
          <pre>{{ JSON.stringify(classroomStore, null, 2) }}</pre>
        </section>
      </aside>
    </section>
  </main>
</template>
