import {z} from 'zod'

/**
 * 服务端业务事件共有的可靠传输字段。
 * Schema 同时承担运行时校验和 TypeScript 类型生成，避免维护两套定义。
 */
const eventEnvelope = {
  kind: z.literal('event'),
  channel: z.string(),
  liveId: z.string(),
  seq: z.number().int().nonnegative(),
  msgId: z.string().min(1),
  version: z.number().int().nonnegative(),
  serverTime: z.number(),
  recovered: z.boolean().optional(),
  deliveryAttempt: z.number().int().positive().optional()
}

const studentHandUpChangedSchema = z.object({
  ...eventEnvelope,
  type: z.literal('STUDENT_HAND_UP_CHANGED'),
  payload: z.object({
    stuId: z.string().min(1),
    isHandUp: z.boolean()
  })
})

const stageChangedSchema = z.object({
  ...eventEnvelope,
  type: z.literal('STAGE_CHANGED'),
  payload: z.object({
    stageStudents: z.array(z.string())
  })
})

const coursewarePageChangedSchema = z.object({
  ...eventEnvelope,
  type: z.literal('COURSEWARE_PAGE_CHANGED'),
  payload: z.object({
    page: z.number().int().min(1)
  })
})

const interactionAnsweredSchema = z.object({
  ...eventEnvelope,
  type: z.literal('INTERACTION_ANSWERED'),
  payload: z.object({
    stuId: z.string().min(1),
    answer: z.string(),
    answeredStudents: z.array(z.string())
  })
})

const studentScoreChangedSchema = z.object({
  ...eventEnvelope,
  type: z.literal('STUDENT_SCORE_CHANGED'),
  payload: z.object({
    stuId: z.string().min(1),
    score: z.number()
  })
})

/**
 * 授课端当前支持的全部业务事件。
 *
 * 新增事件时需要：
 * 1. 在这里加入新的事件类型。
 * 2. 在 parseBusinessEvent 中增加运行时 payload 校验。
 * 3. 在 classroomStore 的 switch 中处理状态更新。
 */
export const businessEventSchema = z.discriminatedUnion('type', [
  studentHandUpChangedSchema,
  stageChangedSchema,
  coursewarePageChangedSchema,
  interactionAnsweredSchema,
  studentScoreChangedSchema
])

export type BusinessEvent = z.infer<typeof businessEventSchema>
export type StudentHandUpChangedEvent = Extract<BusinessEvent, {type: 'STUDENT_HAND_UP_CHANGED'}>
export type StageChangedEvent = Extract<BusinessEvent, {type: 'STAGE_CHANGED'}>
export type CoursewarePageChangedEvent = Extract<BusinessEvent, {type: 'COURSEWARE_PAGE_CHANGED'}>
export type InteractionAnsweredEvent = Extract<BusinessEvent, {type: 'INTERACTION_ANSWERED'}>
export type StudentScoreChangedEvent = Extract<BusinessEvent, {type: 'STUDENT_SCORE_CHANGED'}>

/**
 * safeParse 不抛异常。校验失败返回 null，由 WebSocketManager 统一记录协议错误。
 */
export function parseBusinessEvent(value: unknown): BusinessEvent | null {
  const result = businessEventSchema.safeParse(value)
  return result.success ? result.data : null
}
