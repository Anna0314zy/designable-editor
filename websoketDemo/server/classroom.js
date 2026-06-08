const students = {
  stu_001: {id: 'stu_001', name: '小乐', isHandUp: false, score: 0},
  stu_002: {id: 'stu_002', name: '小读', isHandUp: false, score: 0},
  stu_003: {id: 'stu_003', name: '小课', isHandUp: false, score: 0}
}

export class ClassroomAggregate {
  constructor(liveId) {
    this.liveId = liveId
    this.version = 0
    this.students = structuredClone(students)
    this.stageStudents = []
    this.currentPage = 1
    this.interaction = {
      status: 'idle',
      answers: {}
    }
  }

  snapshot() {
    return {
      liveId: this.liveId,
      version: this.version,
      students: structuredClone(this.students),
      stageStudents: [...this.stageStudents],
      currentPage: this.currentPage,
      interaction: structuredClone(this.interaction)
    }
  }

  execute(type, payload = {}) {
    const student = payload.stuId ? this.students[payload.stuId] : null

    switch (type) {
      case 'student.setHandUp':
        this.assertStudent(student)
        student.isHandUp = Boolean(payload.isHandUp)
        return this.event('STUDENT_HAND_UP_CHANGED', {
          stuId: student.id,
          isHandUp: student.isHandUp
        })
      case 'stage.set':
        this.assertStudent(student)
        this.stageStudents = payload.onStage
          ? Array.from(new Set([...this.stageStudents, student.id]))
          : this.stageStudents.filter(id => id !== student.id)
        return this.event('STAGE_CHANGED', {
          stageStudents: [...this.stageStudents]
        })
      case 'courseware.setPage':
        this.currentPage = Math.max(1, Number(payload.page || 1))
        return this.event('COURSEWARE_PAGE_CHANGED', {
          page: this.currentPage
        })
      case 'interaction.answer':
        this.assertStudent(student)
        this.interaction.status = 'running'
        this.interaction.answers[student.id] = String(payload.answer || '')
        return this.event('INTERACTION_ANSWERED', {
          stuId: student.id,
          answer: this.interaction.answers[student.id],
          answeredStudents: Object.keys(this.interaction.answers)
        })
      case 'student.reward':
        this.assertStudent(student)
        student.score += Number(payload.points || 0)
        return this.event('STUDENT_SCORE_CHANGED', {
          stuId: student.id,
          score: student.score
        })
      default:
        throw new Error(`unknown command: ${type}`)
    }
  }

  event(type, payload) {
    this.version += 1
    return {
      type,
      version: this.version,
      payload
    }
  }

  assertStudent(student) {
    if (!student) throw new Error('student not found')
  }
}
