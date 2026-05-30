export const taskTypes = [
  {
    taskType: 'coinBank',
    groupName: 'coinBank',
    name: '发起红包',
  },
  {
    taskType: 'normal',
    groupName: 'normal',
    name: '提示',
  },
  {
    taskType: 'startGame',
    groupName: 'normalGame',
    name: '普通游戏',
  },
  {
    taskType: 'startGame',
    groupName: 'starRainingGame',
    name: '星豆雨',
  },
  {
    taskType: 'startGame',
    groupName: 'workGame',
    name: '作品',
  },
  {
    taskType: 'worksReview',
    groupName: 'workGame',
    name: '作品点评',
  },
  {
    taskType: 'playVideo',
    groupName: 'playVideo',
    name: '播放视频',
  },
  {
    taskType: 'startPraise',
    groupName: 'praiseBoard',
    name: '表扬榜环节',
  },
  {
    taskType: 'championGroupPraise',
    groupName: 'praiseBoard',
    name: '冠军小组上台',
  },
  {
    taskType: 'ownGroupPraise',
    groupName: 'praiseBoard',
    name: '各自小组上台',
  },
  {
    taskType: 'startGame',
    groupName: 'pkGame',
    name: '游戏名称',
  },
  {
    taskType: 'pkGamePraise',
    groupName: 'pkGame',
    name: '表扬榜',
  },
  {
    taskType: 'championGroupPraise',
    groupName: 'pkGame',
    name: '冠军小组',
  },
  {
    taskType: 'ownGroupPraise',
    groupName: 'pkGame',
    name: '各自小组奖励',
  },
] as const
export type ITaskType = typeof taskTypes[number]['taskType']
export type GroupType = typeof taskTypes[number]['groupName']
export type WidgetType = 'input' | 'inputNumber' | 'radio' | 'textarea' | 'text' | 'slider' | 'void'
export enum TaskForm {
  promptTask = 'prompt',
  initiatedTask = 'initiated',
}
// export interface RewardExt {
//   rewardPercent: number // 红包大小
//   rewardSkin: string // 红包皮肤
// }
// export interface GameExt {
//   gameType: string;
// 	haveTestQuestions?: boolean;
// 	gameId: number;
// 	gameTemplateId: number;
// 	gameName:string
//   coin?: string // 可分配金币 只有星豆雨游戏有这个字段
// }
export interface ITask {
  pageId?: string
  groupId: string
  groupName: GroupType
  elementId?: string // 元素生成的任务
  taskForm: TaskForm
  taskType: ITaskType
  id?: number | string // 唯一性
  words?: string
  taskName: string
  description?: string //任务提示内容
  taskDurationSecond?: number // 任务持续时间(秒)
  endMethod?: string // 任务结束方式
  retryStatus?: string // 是否可重试
  skipStatus?: string // 是否可跳过
  followUpLinkageType?: string // 后续联动方式
  sortIndex?: number // 排序
  countdownDisplay?: string // 是否显示倒计时
  rewardPercent?: number // 红包大小
  rewardSkin?: string // 红包皮肤
  coinAmount?: string // 可分配金币
  taskExt?:Record<string,any>
}
export enum RewardSkin {
  'egg' = 'excellent', // 扭蛋
  'reward' = 'normal', // 宝箱
}
export enum Method {
  'auto' = 'auto',
  'manual' = 'manual',
}

export type EndMethod = Method
export enum Status {
  'yes' = 'yes',
  'no' = 'no',
}
export enum FollowUpLinkageType {
  'none' = 'none',
  'auto' = 'autoNext',
  'turnPage' = 'turnPage',
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
