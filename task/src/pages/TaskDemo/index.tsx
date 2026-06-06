import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  Slider,
  Space,
  Switch,
  Typography,
} from 'antd'
import { CodeOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import {
  FollowUpLinkageType,
  ITask,
  Method,
  RewardSkin,
  Status,
  TaskForm,
} from '@editor/typing'
import { groupBy, isEqual } from 'lodash-es'
import styles from './styles.module.less'

type TaskWidget = 'text' | 'input' | 'textarea' | 'inputNumber' | 'radio' | 'slider' | 'select' | 'switch'
type TaskSchemaKey = 'normal' | 'coinBank' | 'praiseBoard' | 'starRainingGame' | 'abc'
type TaskGroupName = ITask['groupName'] | 'abc'
type ConditionOperator = 'eq' | 'neq'
type PayloadMapperName = 'default' | 'coinBank' | 'starRainingGame' | 'abc'

type TaskDemoTask = Omit<ITask, 'id' | 'groupName' | 'taskType'> & {
  taskId: string
  schemaKey?: TaskSchemaKey
  groupName: TaskGroupName
  taskType: ITask['taskType'] | 'abcQuestion'
  answerMode?: 'single' | 'multiple'
  allowMultiple?: boolean
  optionA?: string
  optionB?: string
  optionC?: string
  correctAnswer?: string | string[]
  randomizeOptions?: boolean
  scoreStrategy?: 'allCorrect' | 'partial'
  minCorrectCount?: number
  targetPageId?: string
  hasTeacherWords?: boolean
}

interface SchemaCondition {
  field: keyof TaskDemoTask
  operator: ConditionOperator
  value: unknown
}

interface DeclaredValidator {
  name: string
  message: string
  params?: Record<string, unknown>
}

interface DeclaredEffect {
  name: string
  when?: SchemaCondition[]
  params?: Record<string, unknown>
}

interface TaskFieldSchema {
  key: keyof TaskDemoTask
  label: string
  widget: TaskWidget
  options?: { label: string; value: string | number | boolean }[]
  props?: Record<string, unknown>
  required?: boolean
  requiredMessage?: string
  visibleWhen?: SchemaCondition[]
  validators?: DeclaredValidator[]
}

interface TaskSchema {
  schemaKey: TaskSchemaKey
  title: string
  fields: TaskFieldSchema[]
  effects?: DeclaredEffect[]
  validators?: DeclaredValidator[]
  payloadMapper: PayloadMapperName
}

interface TaskFormGroup {
  groupId: string
  groupName: TaskDemoTask['groupName']
  task: TaskDemoTask[]
}

interface BackendTaskType {
  type: string
  label: string
  description: string
  schemaKey: TaskSchemaKey
  defaultTasks: TaskDemoTask[]
}

interface ServerTask extends Omit<TaskDemoTask, 'pageId' | 'schemaKey' | 'rewardPercent' | 'rewardSkin' | 'coinAmount'> {
  sortIndex: number
  taskExt?: Record<string, unknown>
}

interface ValidatorContext {
  value: unknown
  task: TaskDemoTask
  groups: TaskFormGroup[]
  params?: Record<string, unknown>
}

interface EffectContext {
  task: TaskDemoTask
  params?: Record<string, unknown>
}

const slideId = 'task-demo-slide'
const pageId = 'task-demo-page'

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

const getSchemaKey = (task: TaskDemoTask): TaskSchemaKey => {
  return task.schemaKey || (task.groupName as TaskSchemaKey)
}


const baseFields: TaskFieldSchema[] = [
  { key: 'taskName', label: '任务名称', widget: 'text' },
  {
    key: 'description',
    label: '任务提示内容',
    widget: 'textarea',
    required: true,
    requiredMessage: '请填写任务提示内容',
    props: { maxLength: 999, showCount: true, autoSize: { minRows: 2, maxRows: 4 } },
  },
  {
    key: 'words',
    label: '台词',
    widget: 'input',
    props: { placeholder: '可选，老师口播台词' },
  },
  {
    key: 'taskDurationSecond',
    label: '任务持续时间',
    widget: 'inputNumber',
    required: true,
    requiredMessage: '请填写任务持续时间',
    props: { min: 0, max: 999, suffix: '秒' },
  },
  {
    key: 'countdownDisplay',
    label: '是否显示倒计时',
    widget: 'radio',
    options: [
      { label: '是', value: Status.yes },
      { label: '否', value: Status.no },
    ],
  },
  {
    key: 'endMethod',
    label: '任务结束方式',
    widget: 'radio',
    options: [
      { label: '自动', value: Method.auto },
      { label: '手动', value: Method.manual },
    ],
  },
  {
    key: 'skipStatus',
    label: '任务可否跳过',
    widget: 'radio',
    options: [
      { label: '可', value: Status.yes },
      { label: '不可', value: Status.no },
    ],
  },
  {
    key: 'retryStatus',
    label: '任务可否重做',
    widget: 'radio',
    options: [
      { label: '可', value: Status.yes },
      { label: '不可', value: Status.no },
    ],
  },
  {
    key: 'followUpLinkageType',
    label: '任务后续联动',
    widget: 'select',
    options: [
      { label: '无', value: FollowUpLinkageType.none },
      { label: '自动开启下一任务', value: FollowUpLinkageType.auto },
      { label: '翻页', value: FollowUpLinkageType.turnPage },
    ],
  },
]

// taskSchemaRegistry
//   -> fields 控制表单展示
//   -> visibleWhen 控制显隐
//   -> widget/options/props 控制组件
//   -> validators 控制校验
//   -> effects 控制联动
//   -> payloadMapper 控制提交转换
const taskSchemaRegistry: Record<TaskSchemaKey, TaskSchema> = {
  normal: {
    schemaKey: 'normal',
    title: '纯提示任务',
    payloadMapper: 'default',
    fields: baseFields
      .filter(field => field.key !== 'countdownDisplay')
      .concat({
        key: 'hasTeacherWords',
        label: '生成老师台词',
        widget: 'switch',
      }),
  },
  coinBank: {
    schemaKey: 'coinBank',
    title: '红包任务',
    payloadMapper: 'coinBank',
    validators: [
      {
        name: 'rewardPercentTotalLimit',
        message: '红包份额总和不能超过 1',
        params: { max: 1 },
      },
    ],
    fields: baseFields
      .filter(field => field.key !== 'words')
      .concat([
        {
          key: 'rewardSkin',
          label: '红包皮肤',
          widget: 'radio',
          options: [
            { label: '宝箱', value: RewardSkin.reward },
            { label: '扭蛋', value: RewardSkin.egg },
          ],
        },
        {
          key: 'rewardPercent',
          label: '红包份额',
          widget: 'slider',
          required: true,
          requiredMessage: '请配置红包份额',
          props: { min: 0.1, max: 1, step: 0.1 },
        },
      ]),
  },
  praiseBoard: {
    schemaKey: 'praiseBoard',
    title: '表扬榜任务组',
    payloadMapper: 'default',
    fields: baseFields,
  },
  starRainingGame: {
    schemaKey: 'starRainingGame',
    title: '星豆雨游戏任务',
    payloadMapper: 'starRainingGame',
    fields: baseFields
      .filter(field => field.key !== 'words')
      .concat({
        key: 'coinAmount',
        label: '奖励金币',
        widget: 'select',
        options: [
          { label: '100金币', value: '100' },
          { label: '200金币', value: '200' },
          { label: '300金币', value: '300' },
        ],
      }),
  },
  abc: {
    schemaKey: 'abc',
    title: 'ABC 联动任务',
    payloadMapper: 'abc',
    effects: [
      {
        name: 'syncAbcAnswerMode',
        params: { modeField: 'answerMode', answerField: 'correctAnswer' },
      },
      {
        name: 'clearFieldWhenHidden',
        params: {
          field: 'targetPageId',
          visibleWhen: [
            { field: 'followUpLinkageType', operator: 'eq', value: FollowUpLinkageType.turnPage },
          ],
        },
      },
    ],
    validators: [
      {
        name: 'abcAnswerRequired',
        message: 'ABC 互动题必须配置正确答案',
        params: { answerField: 'correctAnswer' },
      },
      {
        name: 'turnPageTargetRequired',
        message: 'ABC 互动题选择翻页联动时必须配置翻页目标',
        params: {
          linkageField: 'followUpLinkageType',
          targetField: 'targetPageId',
          linkageValue: FollowUpLinkageType.turnPage,
        },
      },
    ],
    fields: baseFields.concat([
      {
        key: 'answerMode',
        label: '答题模式',
        widget: 'radio',
        options: [
          { label: '单选', value: 'single' },
          { label: '多选', value: 'multiple' },
        ],
      },
      {
        key: 'allowMultiple',
        label: '允许多选',
        widget: 'switch',
      },
      {
        key: 'optionA',
        label: 'A 选项',
        widget: 'input',
        required: true,
        requiredMessage: '请填写 A 选项',
      },
      {
        key: 'optionB',
        label: 'B 选项',
        widget: 'input',
        required: true,
        requiredMessage: '请填写 B 选项',
      },
      {
        key: 'optionC',
        label: 'C 选项',
        widget: 'input',
      },
      {
        key: 'correctAnswer',
        label: '正确答案',
        widget: 'select',
        required: true,
        requiredMessage: '请选择正确答案',
        props: { modeWhen: { field: 'answerMode', value: 'multiple', mode: 'multiple' } },
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' },
        ],
      },
      {
        key: 'scoreStrategy',
        label: '计分策略',
        widget: 'select',
        visibleWhen: [{ field: 'answerMode', operator: 'eq', value: 'multiple' }],
        options: [
          { label: '全部答对得分', value: 'allCorrect' },
          { label: '按答对项部分得分', value: 'partial' },
        ],
      },
      {
        key: 'minCorrectCount',
        label: '至少答对数量',
        widget: 'inputNumber',
        visibleWhen: [{ field: 'answerMode', operator: 'eq', value: 'multiple' }],
        props: { min: 1, max: 3 },
        validators: [
          {
            name: 'lteArrayLength',
            message: '至少答对数量不能超过正确答案数量',
            params: { targetField: 'correctAnswer' },
          },
        ],
      },
      {
        key: 'randomizeOptions',
        label: '随机选项顺序',
        widget: 'switch',
      },
      {
        key: 'targetPageId',
        label: '翻页目标',
        widget: 'select',
        visibleWhen: [{ field: 'followUpLinkageType', operator: 'eq', value: FollowUpLinkageType.turnPage }],
        options: [
          { label: '下一页 page-next', value: 'page-next' },
          { label: '复盘页 page-review', value: 'page-review' },
        ],
      },
    ]),
  },
}

const backendInitialTasks: TaskDemoTask[] = [
  {
    taskId: 'normal-1',
    pageId,
    groupId: 'group-normal',
    groupName: 'normal',
    schemaKey: 'normal',
    taskForm: TaskForm.promptTask,
    taskType: 'normal',
    taskName: '提示',
    description: '老师说明本页学习目标，并引导学生观察页面中的重点元素。',
    words: '我们先看这一页，找到最关键的信息。',
    taskDurationSecond: 45,
    countdownDisplay: Status.no,
    endMethod: Method.manual,
    retryStatus: Status.no,
    skipStatus: Status.yes,
    followUpLinkageType: FollowUpLinkageType.auto,
    hasTeacherWords: true,
  },
  {
    taskId: 'coin-bank-1',
    pageId,
    groupId: 'group-reward',
    groupName: 'coinBank',
    schemaKey: 'coinBank',
    taskForm: TaskForm.initiatedTask,
    taskType: 'coinBank',
    taskName: '发起红包',
    description: '完成观察后发放奖励，鼓励学生积极回答。',
    words: '',
    taskDurationSecond: 30,
    countdownDisplay: Status.no,
    endMethod: Method.auto,
    retryStatus: Status.no,
    skipStatus: Status.no,
    followUpLinkageType: FollowUpLinkageType.none,
    rewardSkin: RewardSkin.reward,
    rewardPercent: 0.2,
  },
  {
    taskId: 'praise-1',
    pageId,
    groupId: 'group-praise',
    groupName: 'praiseBoard',
    schemaKey: 'praiseBoard',
    taskForm: TaskForm.initiatedTask,
    taskType: 'startPraise',
    taskName: '表扬榜环节',
    description: '对本页表现积极的小组进行表扬。',
    words: '',
    taskDurationSecond: 60,
    countdownDisplay: Status.no,
    endMethod: Method.manual,
    retryStatus: Status.no,
    skipStatus: Status.no,
    followUpLinkageType: FollowUpLinkageType.auto,
  },
  {
    taskId: 'praise-2',
    pageId,
    groupId: 'group-praise',
    groupName: 'praiseBoard',
    schemaKey: 'praiseBoard',
    taskForm: TaskForm.initiatedTask,
    taskType: 'championGroupPraise',
    taskName: '冠军小组上台',
    description: '邀请冠军小组展示成果。',
    words: '',
    taskDurationSecond: 45,
    countdownDisplay: Status.no,
    endMethod: Method.manual,
    retryStatus: Status.no,
    skipStatus: Status.no,
    followUpLinkageType: FollowUpLinkageType.none,
  },
  {
    taskId: 'star-game-1',
    pageId,
    groupId: 'group-game',
    groupName: 'starRainingGame',
    schemaKey: 'starRainingGame',
    taskForm: TaskForm.initiatedTask,
    taskType: 'startGame',
    taskName: '星豆雨',
    description: '开启星豆雨游戏，学生完成互动挑战。',
    words: '',
    taskDurationSecond: 120,
    countdownDisplay: Status.yes,
    endMethod: Method.auto,
    retryStatus: Status.no,
    skipStatus: Status.no,
    followUpLinkageType: FollowUpLinkageType.none,
    coinAmount: '200',
  },
  {
    taskId: 'abc-1',
    pageId,
    groupId: 'group-abc',
    groupName: 'abc',
    schemaKey: 'abc',
    taskForm: TaskForm.initiatedTask,
    taskType: 'abcQuestion',
    taskName: 'ABC 互动题',
    description: '学生完成 ABC 选择题，提交后根据答题结果进入后续流程。',
    words: '看题目，选择你认为正确的答案。',
    taskDurationSecond: 90,
    countdownDisplay: Status.yes,
    endMethod: Method.auto,
    retryStatus: Status.yes,
    skipStatus: Status.no,
    followUpLinkageType: FollowUpLinkageType.turnPage,
    answerMode: 'single',
    allowMultiple: false,
    optionA: '先观察题干关键词',
    optionB: '直接猜答案',
    optionC: '和同伴讨论后提交',
    correctAnswer: 'A',
    scoreStrategy: 'allCorrect',
    minCorrectCount: 1,
    randomizeOptions: true,
    targetPageId: 'page-review',
  },
]

const mockBackendTaskTypes: BackendTaskType[] = [
  {
    type: 'normal',
    label: '纯提示任务',
    description: '单任务组，演示普通字段和老师台词开关。',
    schemaKey: 'normal',
    defaultTasks: [backendInitialTasks[0]],
  },
  {
    type: 'coinBank',
    label: '红包任务',
    description: '奖励配置进入 taskExt。',
    schemaKey: 'coinBank',
    defaultTasks: [backendInitialTasks[1]],
  },
  {
    type: 'praiseBoard',
    label: '表扬榜',
    description: '一个按钮添加多个联动任务。',
    schemaKey: 'praiseBoard',
    defaultTasks: [backendInitialTasks[2], backendInitialTasks[3]],
  },
  {
    type: 'starRainingGame',
    label: '星豆雨',
    description: '游戏扩展配置进入 taskExt。',
    schemaKey: 'starRainingGame',
    defaultTasks: [backendInitialTasks[4]],
  },
  {
    type: 'abc',
    label: 'ABC 联动题',
    description: '演示复杂显隐、控件切换和提交校验。',
    schemaKey: 'abc',
    defaultTasks: [backendInitialTasks[5]],
  },
]

const groupTitle: Record<string, string> = {
  normal: '纯提示任务',
  coinBank: '红包任务',
  praiseBoard: '表扬榜任务组',
  starRainingGame: '游戏任务',
  abc: 'ABC 联动任务',
}

const getTaskSchema = (task: TaskDemoTask) => taskSchemaRegistry[getSchemaKey(task)]

const evaluateCondition = (task: TaskDemoTask, condition: SchemaCondition) => {
  const currentValue = task[condition.field]
  if (condition.operator === 'eq') return currentValue === condition.value
  if (condition.operator === 'neq') return currentValue !== condition.value
  return true
}

const evaluateConditions = (task: TaskDemoTask, conditions: SchemaCondition[] = []) => {
  return conditions.every(condition => evaluateCondition(task, condition))
}

const getVisibleFields = (task: TaskDemoTask) => {
  return getTaskSchema(task).fields.filter(field => evaluateConditions(task, field.visibleWhen))
}

const toFormGroups = (tasks: TaskDemoTask[]): TaskFormGroup[] => {
  const grouped = groupBy(tasks, 'groupId')
  return Object.values(grouped).map(groupTasks => ({
    groupId: groupTasks[0].groupId,
    groupName: groupTasks[0].groupName,
    task: groupTasks,
  }))
}

const flattenTasks = (groups: TaskFormGroup[] = []) => {
  return groups.flatMap(group => group.task || [])
}

const instantiateBackendTasks = (taskType: BackendTaskType) => {
  const groupIdMap = new Map<string, string>()

  return taskType.defaultTasks.map(task => {
    if (!groupIdMap.has(task.groupId)) {
      groupIdMap.set(task.groupId, createId(task.groupId))
    }

    return {
      ...task,
      schemaKey: taskType.schemaKey,
      groupId: groupIdMap.get(task.groupId)!,
      taskId: createId(`${taskType.schemaKey}-${task.taskType}`),
    }
  })
}

const validatorRegistry: Record<string, (context: ValidatorContext) => boolean> = {
  lteArrayLength({ value, task, params }) {
    const targetField = params?.targetField as keyof TaskDemoTask
    const targetValue = task[targetField]
    const length = Array.isArray(targetValue) ? targetValue.length : targetValue ? 1 : 0
    return !value || Number(value) <= length
  },
  abcAnswerRequired({ task, params }) {
    const answerField = params?.answerField as keyof TaskDemoTask
    const value = task[answerField]
    return Array.isArray(value) ? value.length > 0 : Boolean(value)
  },
  turnPageTargetRequired({ task, params }) {
    const linkageField = params?.linkageField as keyof TaskDemoTask
    const targetField = params?.targetField as keyof TaskDemoTask
    if (task[linkageField] !== params?.linkageValue) return true
    return Boolean(task[targetField])
  },
  rewardPercentTotalLimit({ groups, params }) {
    const max = Number(params?.max ?? 1)
    const total = flattenTasks(groups)
      .filter(task => getSchemaKey(task) === 'coinBank')
      .reduce((sum, task) => sum + (Number(task.rewardPercent) || 0), 0)
    return total <= max
  },
}

const effectRegistry: Record<string, (context: EffectContext) => TaskDemoTask> = {
  syncAbcAnswerMode({ task, params }) {
    const modeField = params?.modeField as keyof TaskDemoTask
    const answerField = params?.answerField as keyof TaskDemoTask
    const nextTask = { ...task }

    if (nextTask[modeField] === 'multiple') {
      nextTask.allowMultiple = true
      const answer = nextTask[answerField]
      nextTask[answerField] = (Array.isArray(answer) ? answer : answer ? [answer] : []) as never
      nextTask.scoreStrategy = nextTask.scoreStrategy || 'allCorrect'
      nextTask.minCorrectCount = nextTask.minCorrectCount || 1
      return nextTask
    }

    nextTask.allowMultiple = false
    const answer = nextTask[answerField]
    nextTask[answerField] = (Array.isArray(answer) ? answer[0] || 'A' : answer || 'A') as never
    delete nextTask.scoreStrategy
    delete nextTask.minCorrectCount
    return nextTask
  },
  clearFieldWhenHidden({ task, params }) {
    const field = params?.field as keyof TaskDemoTask
    const visibleWhen = params?.visibleWhen as SchemaCondition[] | undefined
    if (evaluateConditions(task, visibleWhen)) return task
    const nextTask = { ...task }
    delete nextTask[field]
    return nextTask
  },
}
// 服务端可能不希望 rewardPercent/rewardSkin 平铺在任务上，而是要放到 taskExt：

const payloadMapperRegistry: Record<PayloadMapperName, (task: TaskDemoTask, sortIndex: number) => ServerTask> = {
  default(task, sortIndex) {
    const { pageId: _pageId, schemaKey: _schemaKey, hasTeacherWords: _hasTeacherWords, ...rest } = task
    return { ...rest, sortIndex }
  },
  coinBank(task, sortIndex) {
    const { pageId: _pageId, schemaKey: _schemaKey, rewardPercent, rewardSkin, hasTeacherWords: _hasTeacherWords, ...rest } = task
    return {
      ...rest,
      words: '',
      sortIndex,
      taskExt: { rewardPercent, rewardSkin },
    }
  },
  starRainingGame(task, sortIndex) {
    const { pageId: _pageId, schemaKey: _schemaKey, coinAmount, hasTeacherWords: _hasTeacherWords, ...rest } = task
    return {
      ...rest,
      words: '',
      sortIndex,
      taskExt: {
        ...(rest.taskExt || {}),
        coinAmount,
      },
    }
  },
  abc(task, sortIndex) {
    const {
      pageId: _pageId,
      schemaKey: _schemaKey,
      hasTeacherWords: _hasTeacherWords,
      answerMode,
      allowMultiple,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      randomizeOptions,
      scoreStrategy,
      minCorrectCount,
      targetPageId,
      ...rest
    } = task

    return {
      ...rest,
      sortIndex,
      taskExt: {
        answerMode,
        allowMultiple,
        options: [
          { key: 'A', text: optionA },
          { key: 'B', text: optionB },
          { key: 'C', text: optionC },
        ].filter(option => option.text),
        correctAnswer,
        randomizeOptions,
        scoreStrategy,
        minCorrectCount,
        targetPageId,
      },
    }
  },
}

const widgetRegistry: Record<TaskWidget, (field: TaskFieldSchema, task: TaskDemoTask) => JSX.Element | null> = {
  text() {
    return <Input readOnly variant='borderless' />
  },
  input(field) {
    return <Input {...field.props} />
  },
  textarea(field) {
    return <Input.TextArea {...field.props} />
  },
  inputNumber(field) {
    return <InputNumber controls={false} {...field.props} />
  },
  radio(field) {
    return <Radio.Group options={field.options} />
  },
  slider(field) {
    return <Slider {...field.props} />
  },
  select(field, task) {
    const modeWhen = field.props?.modeWhen as { field: keyof TaskDemoTask; value: unknown; mode: 'multiple' } | undefined
    const computedProps = { ...field.props }
    delete computedProps.modeWhen
    if (modeWhen && task[modeWhen.field] === modeWhen.value) {
      computedProps.mode = modeWhen.mode
    }
    return <Select options={field.options} {...computedProps} />
  },
  switch() {
    return <Switch />
  },
}

const applyTaskEffects = (task: TaskDemoTask) => {
  const schema = getTaskSchema(task)
  return (schema.effects || []).reduce((currentTask, effect) => {
    if (!evaluateConditions(currentTask, effect.when)) return currentTask
    return effectRegistry[effect.name]?.({ task: currentTask, params: effect.params }) || currentTask
  }, task)
}

const applyLinkage = (groups: TaskFormGroup[] = []) => {
  return groups.map(group => ({
    ...group,
    task: (group.task || []).map(applyTaskEffects),
  }))
}

const buildFormRules = (field: TaskFieldSchema, taskPath: (string | number)[], form: any, groups: TaskFormGroup[]) => {
  const rules: any[] = []
  if (field.required) {
    rules.push({ required: true, message: field.requiredMessage || `请填写${field.label}` })
  }

  field.validators?.forEach(validator => {
    rules.push({
      validator(_: unknown, value: unknown) {
        const task = form.getFieldValue(taskPath) as TaskDemoTask
        const matched = validatorRegistry[validator.name]?.({ value, task, groups, params: validator.params })
        if (matched !== false) return Promise.resolve()
        return Promise.reject(new Error(validator.message))
      },
    })
  })

  return rules
}

const validateDeclaredRules = (groups: TaskFormGroup[]) => {
  flattenTasks(groups).forEach(task => {
    const schema = getTaskSchema(task)


    schema.validators?.forEach(validator => {
      const matched = validatorRegistry[validator.name]?.({
        value: undefined,
        task,
        groups,
        params: validator.params,
      })
      if (matched === false) {
        throw new Error(validator.message)
      }
    })
  })
}

const toServerPayload = (groups: TaskFormGroup[] = []) => {
  const courseTaskList = flattenTasks(groups).map((task, index) => {
    const schema = getTaskSchema(task)
    return payloadMapperRegistry[schema.payloadMapper](task, index + 1)
  })

  return {
    slideId,
    pageId,
    courseTaskList,
  }
}

function TaskDemo() {
  const [form] = Form.useForm<{ tasks: TaskFormGroup[] }>()
  const initialGroups = useMemo(() => {
    const data = toFormGroups(backendInitialTasks)
    console.log('initialGroups',data)
    return data;
  }, [])
  const [serverPayload, setServerPayload] = useState(() => toServerPayload(initialGroups))
  const [schemaPreview, setSchemaPreview] = useState(() => {
    return flattenTasks(initialGroups).map(task => ({
      taskId: task.taskId,
      schemaKey: getSchemaKey(task),
      taskType: task.taskType,
      fields: getVisibleFields(task).map(field => `${field.key}:${field.widget}`),
    }))
  })

  const refreshOutput = useCallback(
    (groups: TaskFormGroup[]) => {
      const linkedGroups = applyLinkage(groups)


      if (!isEqual(groups, linkedGroups)) {
        form.setFieldsValue({ tasks: linkedGroups })
      }
      setServerPayload(toServerPayload(linkedGroups))
      setSchemaPreview(
        flattenTasks(linkedGroups).map(task => ({
          taskId: task.taskId,
          schemaKey: getSchemaKey(task),
          taskType: task.taskType,
          fields: getVisibleFields(task).map(field => `${field.key}:${field.widget}`),
        })),
      )
      return linkedGroups
    },
    [form],
  )

  const syncOutput = useCallback(() => {
    const groups = form.getFieldValue('tasks') || []
    refreshOutput(groups)
  }, [form, refreshOutput])

  const handleAddTask = useCallback(
    (taskType: BackendTaskType) => {
      const currentGroups = form.getFieldValue('tasks') || []
      const nextGroups = currentGroups.concat(toFormGroups(instantiateBackendTasks(taskType)))
      form.setFieldsValue({ tasks: nextGroups })
      refreshOutput(nextGroups)
      message.success(`已添加${taskType.label}`)
    },
    [form, refreshOutput],
  )

  const handleSubmit = useCallback(async () => {
    try {
      console.log('form-biaodan数据',form.getFieldsValue())
      // const values = await form.validateFields()
      // const linkedGroups = refreshOutput(values.tasks || [])
      // validateDeclaredRules(linkedGroups)
      // setServerPayload(toServerPayload(linkedGroups))
      const values = await form.validateFields()
const linkedGroups = refreshOutput(values.tasks || [])
form.setFieldsValue({ tasks: linkedGroups })
await form.validateFields()
validateDeclaredRules(linkedGroups)
setServerPayload(toServerPayload(linkedGroups))

      message.success('校验通过，payload 已生成')
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('请先修正表单必填项')
        return
      }
      message.error(error?.message || '提交校验失败')
    }
  }, [form, refreshOutput])

  const handleReset = useCallback(() => {
    form.setFieldsValue({ tasks: initialGroups })
    refreshOutput(initialGroups)
  }, [form, initialGroups, refreshOutput])

  const currentGroups = form.getFieldValue('tasks') || initialGroups

  return (
    <main className={styles.page}>
      <section className={styles.toolbar}>
        <div>
          <Typography.Title level={3}>任务动态表单 Demo</Typography.Title>
          <Typography.Text type='secondary'>
            后端 mock 只下发纯 JSON schema/defaultTasks，前端 registry 统一解释渲染、联动、校验和 payload。
          </Typography.Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置 mock
          </Button>
          <Button icon={<CodeOutlined />} onClick={syncOutput}>
            刷新 payload
          </Button>
          <Button type='primary' onClick={handleSubmit}>
            提交校验
          </Button>
        </Space>
      </section>

      <section className={styles.catalog}>
        <div className={styles.catalogTitle}>
          <Typography.Text strong>服务端返回的任务类型</Typography.Text>
          <Typography.Text type='secondary'>按钮由 mockBackendTaskTypes 渲染：后端给 schemaKey/defaultTasks，前端查 registry。</Typography.Text>
        </div>
        <Space wrap>
          {mockBackendTaskTypes.map(taskType => (
            <Button
              key={taskType.type}
              icon={<PlusOutlined />}
              title={taskType.description}
              onClick={() => handleAddTask(taskType)}
            >
              {taskType.label}
            </Button>
          ))}
        </Space>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.schemaPanel}>
          <Typography.Title level={5}>Schema 预览</Typography.Title>
          <pre>{JSON.stringify(schemaPreview, null, 2)}</pre>
        </aside>

        <section className={styles.formPanel}>
          <Form
            form={form}
            layout='vertical'
            initialValues={{ tasks: initialGroups }}
            onValuesChange={syncOutput}
          >
            <Form.List name='tasks'>
              {groupFields => (
                <Collapse
                  defaultActiveKey={groupFields.map(field => String(field.key))}
                  items={groupFields.map(groupField => {
                    const group = form.getFieldValue(['tasks', groupField.name]) as TaskFormGroup
                    return {
                      key: String(groupField.key),
                      label: `${groupTitle[group.groupName] || group.groupName} · ${group.groupId}`,
                      children: (
                        <Form.List {...groupField} name={[groupField.name, 'task']}>
                          {taskFields => (
                            <div className={styles.taskList}>
                              {taskFields.map(taskField => {
                                const taskPath = ['tasks', groupField.name, 'task', taskField.name]

                                console.log('taskPath----',taskPath)
                                const task = form.getFieldValue(taskPath) as TaskDemoTask
                                const schema = getVisibleFields(task)

                                console.log('schema',task,schema)

                                return (
                                  <div className={styles.taskBlock} key={taskField.key}>
                                    <div className={styles.taskHeader}>
                                      <Typography.Text strong>{task.taskName}</Typography.Text>
                                      <Typography.Text type='secondary'>
                                        {getSchemaKey(task)}/{task.taskType}
                                      </Typography.Text>
                                    </div>
                                    <div className={styles.fieldGrid}>
                                      {schema.map(field => (
                                        <Form.Item
                                          key={field.key}
                                          label={field.label}
                                          name={[taskField.name, field.key]}
                                          valuePropName={field.widget === 'switch' ? 'checked' : 'value'}
                                          rules={buildFormRules(field, taskPath, form, currentGroups)}
                                        >
                                          {widgetRegistry[field.widget](field, task)}
                                        </Form.Item>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </Form.List>
                      ),
                    }
                  })}
                />
              )}
            </Form.List>
          </Form>
        </section>

        <aside className={styles.payloadPanel}>
          <Typography.Title level={5}>服务端 payload</Typography.Title>
          <pre>{JSON.stringify(serverPayload, null, 2)}</pre>
        </aside>
      </section>
    </main>
  )
}

export default TaskDemo
