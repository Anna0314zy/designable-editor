import { Rule } from 'antd/es/form'
import {
  ITask,
	Status,
	Method,
	FollowUpLinkageType,
  RewardSkin,
} from "@editor/typing";
interface IOptions {
  name: string
  value: string
}
import { store } from '@/store'
import { ReactNode } from 'react'
// 每个任务必须的字段
export type BaseTaskKey = Omit<ITask, 'rewardPercent' | 'rewardSkin'>

export const baseKey: (keyof ITask)[] = [
  'groupId',
  'groupName',
  'taskType',
  'taskName',
  'id',
  'description',
  'words',
  'taskDurationSecond',
  'countdownDisplay',
  'endMethod',
  'retryStatus',
  'skipStatus',
  'followUpLinkageType',
]

export const rewardAddKey: (keyof ITask)[] = ['rewardSkin', 'rewardPercent']
export const rewardFilterKey: (keyof ITask)[] = ['words']
export type WidgetType = 'input' | 'inputNumber' | 'radio' | 'textarea' | 'text' | 'slider' | 'void'
export interface IConfigData {
  taskType: keyof ITask
  pageId?: string
  id?: string | number
  name?: string
  type?: WidgetType
  rules?: Rule[]
  formatter?: (val: number) => ReactNode
  handleChange?: (args: any) => void
  node?: (data: IConfigData) => JSX.Element
  suffix?: string
  options?: IOptions[]
  editable?: boolean
  props?: any
}

export const rewardSkinOptions = [
  {
    name: '宝箱',
    value: RewardSkin.reward,
  },
  {
    name: '扭蛋',
    value: RewardSkin.egg,
  },
]

export const endMethodOptions = [
  {
    name: '自动',
    value: Method.auto,
  },
  {
    name: '手动',
    value: Method.manual,
  },
]
export const retryStatusOptions = [
  {
    name: '可',
    value: Status.yes,
  },
  {
    name: '不可',
    value: Status.no,
  },
]
export const skipStatusOptions = [
  {
    name: '可',
    value: Status.yes,
  },
  {
    name: '不可',
    value: Status.no,
  },
]
export const countdownOptions = [
  {
    name: '是',
    value: Status.yes,
  },
  {
    name: '否',
    value: Status.no,
  },
]
export const nextTaskOptions = [
  {
    name: '无',
    value: FollowUpLinkageType.none,
  },
  {
    name: '自动开启下一任务',
    value: FollowUpLinkageType.auto,
  },
  {
    name: '翻页',
    value: FollowUpLinkageType.turnPage,
  },
]

const getRewardSizeRules = (): Rule[] => {
  return [
    () => ({
      validator() {
        const maxRewardPercent = store.getState().task.maxRewardPercent
        const rewardTasks = store.getState().task.tasks.filter((item: ITask) => item.groupName === 'coinBank')
        const total = rewardTasks.reduce((prev: number, cur: ITask) => {
          return prev + cur.rewardPercent!
        }, 0)
        console.log('validator', total, total > maxRewardPercent)
        if (total > maxRewardPercent) return Promise.reject(new Error('红包份额配置超了'))
        return Promise.resolve()
      },
    }),
  ]
}
// form 表单字段配置
export const taskSchema: IConfigData[] = [
  {
    taskType: 'taskName',
    name: '任务',
    type: 'text',
  },
  {
    taskType: 'description',
    name: '任务提示内容',
    type: 'textarea',
    props: {
      maxLength: 999,
      showCount: true,
      autoSize: { minRows: 2 },
    },
  },
  {
    taskType: 'words',
    name: '台词',
    type: 'void',
    props: {
      maxLength: 999,
      showCount: true,
    },
  },
  {
    taskType: 'taskDurationSecond',
    name: '任务持续时间',
    type: 'inputNumber',
    // suffix: '秒',
    props: {
      min: 0,
      max: 999,
      suffix: '秒',
    },
  },
  {
    taskType: 'countdownDisplay',
    name: '是否显示倒计时',
    type: 'radio',
    options: countdownOptions,
  },

  {
    taskType: 'endMethod',
    name: '任务结束方式',
    type: 'radio',
    options: endMethodOptions,
    editable: false,
  },
  {
    taskType: 'skipStatus',
    name: '任务可否跳过',
    type: 'radio',
    options: skipStatusOptions,
    editable: false,
  },
  {
    taskType: 'retryStatus',
    name: '任务可否重做',
    type: 'radio',
    options: retryStatusOptions,
    editable: false,
  },

  {
    taskType: 'followUpLinkageType',
    name: '任务后续联动',
    type: 'radio',
    options: nextTaskOptions,
    editable: false,
  },
]
export const rewardExtra:IConfigData[] = [
  {
    taskType: 'rewardSkin',
    name: '红包皮肤选择',
    type: 'radio',
    options: rewardSkinOptions,
  },
  {
    taskType: 'rewardPercent',
    name: '红包大小配置',
    type: 'slider',
    rules: getRewardSizeRules(),
    props: {
      min: 0.1,
      max: 1,
      step: 0.1,
      tooltip: {
        open: false,
        placement: 'bottom',
        formatter: (value: number = 0): ReactNode => `${value * 100}%`,
      },
    },
    formatter: (value: number = 0): ReactNode => `${value * 100}%`,
  },
]

