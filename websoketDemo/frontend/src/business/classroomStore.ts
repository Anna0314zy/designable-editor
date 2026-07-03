import {reactive} from 'vue'
import type {BusinessEvent, SnapshotMessage} from '../realtime/protocol'

export interface Student {
  id: string
  name: string
  isHandUp: boolean
  score: number
}

export interface ClassroomSnapshot {
  liveId: string
  version: number
  students: Record<string, Student>
  stageStudents: string[]
  currentPage: number
  interaction: {
    status: string
    answers: Record<string, string>
  }
}

export const classroomStore = reactive<ClassroomSnapshot>({
  liveId: '',
  version: 0,
  students: {},
  stageStudents: [],
  currentPage: 1,
  interaction: {
    status: 'idle',
    answers: {}
  }
})

const assertNever = (event: never): never => {
  throw new Error(`存在未处理的业务事件：${JSON.stringify(event)}`)
}

export function applySnapshot(message: SnapshotMessage<ClassroomSnapshot>) {
  const snapshot = message.payload
  if (snapshot.version < classroomStore.version) return false

  classroomStore.liveId = snapshot.liveId
  classroomStore.version = snapshot.version
  classroomStore.students = structuredClone(snapshot.students)
  classroomStore.stageStudents = [...snapshot.stageStudents]
  classroomStore.currentPage = snapshot.currentPage
  classroomStore.interaction = structuredClone(snapshot.interaction)
  return true
}

export function applyBusinessEvent(event: BusinessEvent) {
  if (event.version <= classroomStore.version) {
    return {
      applied: false,
      reason: `业务版本防旧：event=${event.version}, local=${classroomStore.version}`
    }
  }

  switch (event.type) {
    case 'STUDENT_HAND_UP_CHANGED': {
      const student = classroomStore.students[event.payload.stuId]
      if (!student) return {applied: false, reason: '学生不存在'}
      student.isHandUp = event.payload.isHandUp
      break
    }
    case 'STAGE_CHANGED':
      classroomStore.stageStudents = [...new Set(event.payload.stageStudents)]
      break
    case 'COURSEWARE_PAGE_CHANGED':
      classroomStore.currentPage = event.payload.page
      break
    case 'INTERACTION_ANSWERED':
      classroomStore.interaction.status = 'running'
      classroomStore.interaction.answers[event.payload.stuId] = event.payload.answer
      break
    case 'STUDENT_SCORE_CHANGED': {
      const student = classroomStore.students[event.payload.stuId]
      if (!student) return {applied: false, reason: '学生不存在'}
      student.score = event.payload.score
      break
    }
    default:
      return assertNever(event)
  }

  classroomStore.version = event.version
  return {applied: true}
}
