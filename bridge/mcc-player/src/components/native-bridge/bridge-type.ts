import { Role } from '@/interface'
// mcc -> native
export enum CommandType {
    GetInitParam = 'getInitParam', // 获取项目 Init 需要的参数
    StoreData = 'storeData', // 往服务器存储课件（包括游戏）的状态数据 上报时机？ 授课端使用
    GetStoredData = 'getStoredData', // 服务器存储的所有数据
    GetCatalogueInfo = 'getCatalogueInfo', // 获取课件目录
    GetCloudControl = 'getCloudControl', // 获取云控配置
    SendRoomItsMessage = 'sendRoomItsMessage', // 发送课件详细操作消息
    HeartBeat = 'heartBeat', // 心跳
    SDKInitProgress = 'SDKInitProgress',   /** 上报SDK初始化进度 */
    CourseReady = 'courseWareReady', // 课件准备好了 端上可以发送当前的pageId 或者断线重连消息
    SendCwState = 'sendCwState', // 授课端 发送课件实时数据
    PageComplete = 'pageComplete', // 当页课件已执行完成 可以进行翻页
    SetPageId = 'setPageId', // 跳转到特定页
    SendGameSyncAction = 'sendGameSyncAction', // 同步游戏操作
    GetPageInfo = 'getPageInfo', // 获取页面信息
    GetPageGameData = 'getPageGameData', // 授课端看学生游戏时，获取当前页游戏数据
    CoursePlayOver = 'coursewarePlayOver',
    VisibilityNavBar = 'visibilityNavBar',
    AnimateChange = 'animateChange',
}

// native -> mcc
export enum NotifyType {
    HandleRoomItsMessage = 'sendRoomItsMessage', // 收到 pomelo 消息后调用
    // HandleReconnected = 'handleReconnected', // 断线重连后调用
    ResizeCW = 'onCourseWareSizeChanged', // 修改屏幕宽高
    HandleCatalogueInfo = 'getCatalogueInfo', // 获取课件目录
    HandleStoredData = 'getStoredData', // params 存在 startPageId时调用根据key获取服务器存储的数据
    HandleInitParam = 'getInitParam',
    HandleCloudControl = 'getCloudControl',
    SetPageId = 'setPageId', // 跳转到特定页
    CWStateChange = 'cwStateChange', // 课件状态改变
    HandleCwState = 'sendCwState', // 发送课件数据
    WatchScreen = 'watchScreen', // 授课端看学生的游戏
    GetPageGameData = 'getPageGameData', // 授课端看学生游戏时，获取当前页游戏数据
    GetOnlineNum = 'getOnlineNum', // 获取在线人数
    AnimateChange = 'animateChange'
}

// native -> 游戏
export enum GameNotifyType {
    OnInteractAction = 'onInteractAction', // 授权、取消授权
    PauseOrResumeGame = 'pauseOrResumeGame', // 暂停和恢复游戏
    SetGameFPS = 'setGameFPS', // 设置游戏FPS
}

export const PomeloMessage = 'pomeloMessage' // pomelo 消息
export const PostTeacherPomeloMessage = 'postTeacherPomeloMessage' // pomelo 消息

export const OnEvent = 'onEvent'
export const OnPomelo = 'pomeloMessage'


export interface InitParam {
    courseWareWidth: number; // 课件展示区域宽度
    courseWareHeight: number; // 课件展示区域高度
    role: Role; // 角色，'sender', 'receiver'
    liveId: string; // 直播讲ID
    userId: string; // 用户ID
    userName: string; // 用户名，方便定位问题
    client: string; // 授课端：tpc；PC端：Mac Windows；ios端：iPad iPhone；Android端：pad aphone
    // ['path1', 'path2'] -> [{ path: 'path1', exist: true }]
    clientDescription: string; // 一些版本号或者其他信息 '{"version":"1.2.3"}'
    /** 批量上报日志频率 */
    gradeId: string; // 年纪
    belongCityId: string; // 分校
    localRootPath: string; // 本地根目录
    gameFps: string; // 游戏帧率
    introductoryLesson: boolean; // 是否为先导课

}