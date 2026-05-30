```js


export enum TaskForm {
  promptTask = 'prompt',  // 提示型任务 
  initiatedTask = 'initiated',// 发起型任务
}

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
// 对应的中文说明在taskTypes 里
export type ITaskType = typeof taskTypes[number]['taskType']
// "coinBank" | "normal" | "startGame" | "worksReview" | "playVideo" | "startPraise" | "championGroupPraise" | "ownGroupPraise" | "pkGamePraise"
export type GroupType = typeof taskTypes[number]['groupName']
//"coinBank" | "normal" | "normalGame" | "starRainingGame" | "workGame" | "playVideo" | "praiseBoard" | "pkGame"
// 任务基础字段
export interface ITask {
  groupId: string
  groupName: GroupType
  elementId?: string // 元素生成的任务
  taskForm: TaskForm // 发起任务还是提示 任务  
  taskType: ITaskType //"coinBank" | "normal" | "startGame" | "worksReview" | "playVideo" | "startPraise" | "championGroupPraise" | "ownGroupPraise" | "pkGamePraise" 对应的中文解释 看 taskType
  id: number | string // 唯一性
  words: string // 台词
  taskName: string // 任务名称
  description: string //任务提示内容
  taskDurationSecond: number // 任务持续时间(秒)
  retryStatus: string // 是否可重试
  skipStatus: string // 是否可跳过
  followUpLinkageType: string // 后续联动方式
  countdownDisplay: string // 是否显示倒计时 --- 放在通用字段里了
}
// 红包任务扩展字段

taskExt: {
  rewardPercent?: number // 红包大小
  rewardSkin?: string // 红包皮肤
}

// 游戏任务扩展字段
taskExt: {
  gameType?: string // 游戏类型 // starRainingGame - 星豆雨
  // normalGame-单人游戏
  // pkGame-PK游戏
  // workGame-作品游戏
  haveTestQuestions?: boolean
  /**
  普通游戏：是否为题目  是（默认）
  作品游戏：是否为题目  否 (默认)
  PK游戏：是否为题目   是
   星豆雨游戏：无，直接添加完成
   */
  gameId: number
  gameTemplateId: number
  coinAmount?: string // 可分配金币 只有星豆雨游戏有这个字段
}