/**
 * @description 动画类型
 * @export
 * @enum {number}
 */
export enum AnimationType {
  /**
   * 入场
   */
  Entrance = "entrance",
  /**
   * 出场
   */
  Exit = "exit",
  /**
   * 强调
   */
  Emphasis = "emphasis",
}

export const AnimationTypeMap = {
  [AnimationType.Entrance]: "入场",
  [AnimationType.Exit]: "出场",
  [AnimationType.Emphasis]: "强调",
}

/**
 * @description 动画方向
 * @export
 * @enum {number}
/**
 * @description
 * @export
 * @enum {number}
 */
export enum AnimationDirection {
  /**
   * 通用
   */
  General = "general",
  /**
   * 下
   */
  Down = "down",
  /**
   * 左
   */
  Left = "left",
  /**
   * 右
   */
  Right = "right",
  /**
   * 上
   */
  Up = "up",
  /**
   * 下左
   */
  DownLeft = "downLeft",
  /**
   * 下右
   */
  DownRight = "downRight",
  /**
   * 上左
   */
  UpLeft = "upLeft",
  /**
   * 上右
   */
  UpRight = "upRight",
  /**
   * x轴
   */
  X = "x",
  /**
   * y轴
   */
  Y = "y",
}

export const AnimationDirectionMap = {
  [AnimationDirection.General]: "通用",
  [AnimationDirection.Down]: "↓",
  [AnimationDirection.Left]: "←",
  [AnimationDirection.Right]: "→",
  [AnimationDirection.Up]: "↑",
  [AnimationDirection.DownLeft]: "↙",
  [AnimationDirection.DownRight]: "↘",
  [AnimationDirection.UpLeft]: "↖",
  [AnimationDirection.UpRight]: "↗",
  [AnimationDirection.X]: "X轴",
  [AnimationDirection.Y]: "Y轴",
}


export enum AnimationStatus {
  /**
   * 等待
   */
  Pending = "pending",
  /**
   * 运行中
   */
  Running = "running",
  /**
   * 暂停
   */
  Paused = "paused",
  /**
   * 停止
   */
  Stopped = "stopped",
  /**
   * 完成
   */
  Finished = "finished",
}

export enum AnimationTrigger {
  /**
   * 自动触发
   */
  Auto = "auto",
  /**
   * 点击触发
   */
  Click = "click",
  /**
   * 并行播放
   */
  Parallel = "parallel",
  /**
   * 串行播放
   */
  Serial = "serial",
}


export interface IAnimate {
  // 动画id
  id: string
  // 排序
  sort?: number
  // 目标元素
  target: string
  // 动画类型
  type: AnimationType
  // 动画名称
  name: string
  // 触发方式
  trigger: AnimationTrigger
  // 触发源
  triggerSource: string
  // 动画方向
  direction: AnimationDirection
  // 动画时长 s
  duration: number
  // 动画延迟
  delay: number
  // 动画状态
  status?: AnimationStatus
}