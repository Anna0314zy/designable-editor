import 'animate.css/animate.min.css'
export * from './config/animate_css'
export * from './types/index'
export * from './engine'
export * from './componments/animate'
export * from './componments/constant'

// 前置，可配置类型说明

// 可触发的事件类型
// 可作为触发的条件
// 可能使用多个动画框架，所以需要进行标记，是选取的哪一个框架

// 引入所有的动画名称，后续进行校验是否存在这个动画，不存在则报错
// 这个动画的声明要在一个地方进行声明，避免出现不一致的问题
// 进入当前的页面应该加载所有的已经设置的动画，来设置元素的状态
// 播放动画 需要加一个是否是预览状态，如果是预览状态，请不要进入循序类播放，只需要演示当前的动画即可
// 1. 判断是否存在这个动画，不存在则报错
// 2. 消费动画的时长
// 监听触发条件
// 触发类 顺序类 延迟类 持续类 速度类
// 引入click监听驱动，来判断是否触发了动画
// 播放下一个动画，上一个动画应该立马回归到完成状态