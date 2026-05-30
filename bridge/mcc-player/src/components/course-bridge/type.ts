// 课件 -> mcc
export enum CoursewareEvent {
    SetPageIdResult = 'setPageIdResult', // 设置课件页id结果
    TransferMessageSend = 'transferMessageSend', // 中转消息发送
    CWStateChange= 'cwStateChange', // 课件状态改变
    PageComplete = 'pageComplete', // 课件页完成
    RecoverCWStateResult = 'recoverCWStateResult', // 恢复课件状态结果
    SetNextPageId = 'setNextPageId', // 先导课跳转下一页
    Ready = 'ready', // 课件准备好了
    SendLog = 'sendLog', // 发送埋点
}

// mcc -> 课件
export enum CoursewareCommand {
    SetPageId = 'setPageId', // 设置课件页，只传课件页id
    TransferMessageReceive = 'transferMessageReceive', // 中转消息接收
    RecoverCWState = 'recoverCWState',  // 恢复课件状态
    SetUid = 'setUid', // 设置用户id
    SetPageUseAble = 'setPageUseAble', // 当前页可以使用
    ResizeCW = 'onCourseWareSizeChanged', // 修改屏幕宽高
}

export interface EventParam {
    type: string,
    param: any,
    msgId?: string
}

export const AllNotifyMessage = 'allNotifyMessage';

export interface SetPageIdResult {
    id: string,
    result: string
}

export interface MessageParam {
    id: string,
    isSender: boolean,
    marked: boolean,
    msgDetail: any,
    msgName: string,
    msgType: string,
    timeStamp: number
}

export interface PageId {
    id: string
}

export enum ResultStatus{
    SUCCESS = 'success',
}


