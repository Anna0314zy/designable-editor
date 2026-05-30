import { AnimationDirection, AnimationType } from "../types";

export interface IBaseAnimation {
  name: string;
  value: string;
  type: AnimationType;
  directions?: { key: AnimationDirection; value: string }[];
}
export interface IAnimation extends IBaseAnimation {
  duration: number;
  delay: number;
  count: number;
  infinite: boolean;
}

export interface IAnimationBaseGroup {
  [AnimationType.Entrance]: IBaseAnimation[];
  [AnimationType.Exit]: IBaseAnimation[];
  [AnimationType.Emphasis]: IBaseAnimation[];
}

export interface IAnimationGroup {
  [AnimationType.Entrance]: IAnimation[];
  [AnimationType.Exit]: IAnimation[];
  [AnimationType.Emphasis]: IAnimation[];
}

export const animationBaseConfigs: IAnimationBaseGroup = {
  [AnimationType.Entrance]: [
    {
      name: "弹跳",
      value: "bounceIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "bounceIn",
        },
        {
          key: AnimationDirection.Up,
          value: "bounceInUp",
        },
        {
          key: AnimationDirection.Down,
          value: "bounceInDown",
        },
        {
          key: AnimationDirection.Right,
          value: "bounceInLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "bounceInRight",
        },
      ],
    },
    {
      name: "浮现",
      value: "fadeIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "fadeIn",
        },
        {
          key: AnimationDirection.Up,
          value: "fadeInUp",
        },
        {
          key: AnimationDirection.Down,
          value: "fadeInDown",
        },
        {
          key: AnimationDirection.Right,
          value: "fadeInLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "fadeInRight",
        },
        // TODO: fadeInUpBig, fadeInDownBig, fadeInLeftBig, fadeInRightBig
      ],
    },
    {
      name: "旋转",
      value: "rotateIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "rotateIn",
        },
        {
          key: AnimationDirection.Up,
          value: "rotateInUpLeft",
        },
        {
          key: AnimationDirection.Down,
          value: "rotateInDownLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "rotateInUpLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "rotateInUpRight",
        },
      ],
    },
    {
      name: "放大飞入",
      value: "zoomIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "zoomIn",
        },
        {
          key: AnimationDirection.Up,
          value: "zoomInUp",
        },
        {
          key: AnimationDirection.Down,
          value: "zoomInDown",
        },
        {
          key: AnimationDirection.Right,
          value: "zoomInLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "zoomInRight",
        },
      ],
    },
    {
      name: "滑入",
      value: "slideIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "slideInUp",
        },
        {
          key: AnimationDirection.Up,
          value: "slideInUp",
        },
        {
          key: AnimationDirection.Down,
          value: "slideInDown",
        },
        {
          key: AnimationDirection.Right,
          value: "slideInLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "slideInRight",
        },
      ],
    },
    {
      name: "翻转",
      value: "flipIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "flipInX",
        },
        {
          key: AnimationDirection.X,
          value: "flipInX",
        },
        {
          key: AnimationDirection.Y,
          value: "flipInY",
        },
      ],
    },
    {
      name: "放大滑入",
      value: "backIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "backInUp",
        },
        {
          key: AnimationDirection.Up,
          value: "backInUp",
        },
        {
          key: AnimationDirection.Down,
          value: "backInDown",
        },
        {
          key: AnimationDirection.Right,
          value: "backInLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "backInRight",
        },
      ],
    },
    {
      name: "飞入",
      value: "lightSpeedIn",
      type: AnimationType.Entrance,
      directions: [
        {
          key: AnimationDirection.General,
          value: "lightSpeedInLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "lightSpeedInLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "lightSpeedInRight",
        },
      ],
    },
  ],
  [AnimationType.Emphasis]: [
    {
      name: "弹跳",
      value: "bounce",
      type: AnimationType.Emphasis,
    },
    {
      name: "左右摇晃",
      value: "shakeX",
      type: AnimationType.Emphasis,
    },
    {
      name: "上下摇晃",
      value: "shakeY",
      type: AnimationType.Emphasis,
    },
    {
      name: "摇头",
      value: "headShake",
      type: AnimationType.Emphasis,
    },
    {
      name: "摆动",
      value: "swing",
      type: AnimationType.Emphasis,
    },
    {
      name: "晃动",
      value: "wobble",
      type: AnimationType.Emphasis,
    },
    {
      name: "哇呀",
      value: "tada",
      type: AnimationType.Emphasis,
    },
    {
      name: "果冻",
      value: "jello",
      type: AnimationType.Emphasis,
    },
    {
      name: "闪烁",
      value: "flash",
      type: AnimationType.Emphasis,
    },
    {
      name: "脉搏",
      value: "pulse",
      type: AnimationType.Emphasis,
    },
    {
      name: "橡皮筋",
      value: "rubberBand",
      type: AnimationType.Emphasis,
    },
    {
      name: "心跳（快）",
      value: "heartBeat",
      type: AnimationType.Emphasis,
    },
  ],
  [AnimationType.Exit]: [
    {
      name: "弹跳",
      value: "bounceOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "bounceOut",
        },
        {
          key: AnimationDirection.Up,
          value: "bounceOutUp",
        },
        {
          key: AnimationDirection.Down,
          value: "bounceOutDown",
        },
        {
          key: AnimationDirection.Left,
          value: "bounceOutLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "bounceOutRight",
        },
      ],
    },
    {
      name: "浮现",
      value: "fadeOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "fadeOut",
        },
        {
          key: AnimationDirection.Up,
          value: "fadeOutUp",
        },
        {
          key: AnimationDirection.Down,
          value: "fadeOutDown",
        },
        {
          key: AnimationDirection.Left,
          value: "fadeOutLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "fadeOutRight",
        },
        // TODO:
      ],
    },
    {
      name: "旋转",
      value: "rotateOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "rotateOut",
        },
        {
          key: AnimationDirection.UpLeft,
          value: "rotateOutUpLeft",
        },
        {
          key: AnimationDirection.DownLeft,
          value: "rotateOutDownLeft",
        },
        {
          key: AnimationDirection.UpRight,
          value: "rotateOutUpRight",
        },
        {
          key: AnimationDirection.DownRight,
          value: "rotateOutDownRight",
        },
      ],
    },
    {
      name: "缩放",
      value: "zoomOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "zoomOut",
        },
        {
          key: AnimationDirection.Up,
          value: "zoomOutUp",
        },
        {
          key: AnimationDirection.Down,
          value: "zoomOutDown",
        },
        {
          key: AnimationDirection.Left,
          value: "zoomOutLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "zoomOutRight",
        },
      ],
    },
    {
      name: "滑出",
      value: "slideOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "slideOutUp",
        },
        {
          key: AnimationDirection.Up,
          value: "slideOutUp",
        },
        {
          key: AnimationDirection.Down,
          value: "slideOutDown",
        },
        {
          key: AnimationDirection.Left,
          value: "slideOutLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "slideOutRight",
        },
      ],
    },
    {
      name: "翻转",
      value: "flipOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "flipOutX",
        },
        {
          key: AnimationDirection.X,
          value: "flipOutX",
        },
        {
          key: AnimationDirection.Y,
          value: "flipOutY",
        },
      ],
    },
    {
      name: "缩小滑出",
      value: "backOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "backOutUp",
        },
        {
          key: AnimationDirection.Up,
          value: "backOutUp",
        },
        {
          key: AnimationDirection.Down,
          value: "backOutDown",
        },
        {
          key: AnimationDirection.Left,
          value: "backOutLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "backOutRight",
        },
      ],
    },
    {
      name: "飞出",
      value: "lightSpeedOut",
      type: AnimationType.Exit,
      directions: [
        {
          key: AnimationDirection.General,
          value: "lightSpeedOutLeft",
        },
        {
          key: AnimationDirection.Left,
          value: "lightSpeedOutLeft",
        },
        {
          key: AnimationDirection.Right,
          value: "lightSpeedOutRight",
        },
      ],
    },
  ],
};

export const animations: IAnimationGroup = Object.keys(
  animationBaseConfigs
).reduce((prev, key) => {
  const type = key as AnimationType;
  prev[type] = animationBaseConfigs[type].map((item) => {
    return {
      ...item,
      duration: 1,
      delay: 0,
      count: 1,
      infinite: false,
    };
  });
  return prev;
}, {} as IAnimationGroup);
