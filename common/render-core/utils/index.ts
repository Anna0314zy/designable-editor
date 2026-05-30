export const isObject = (data: any) => {
  const str = Object.prototype.toString.call(data);
  return str.indexOf('Object') > -1;
};

export const isArray = (data: any) => {
  const str = Object.prototype.toString.call(data);
  return str.indexOf('Array') > -1;
};

export const isNumber = (str: string | number) => !isNaN(Number(str));

export function isCheckBoxType(schema: any, readOnly: boolean) {
  if (readOnly) return false;
  if (schema.widget === 'checkbox') return true;
  if (schema && schema.type === 'boolean') {
    if (schema.enum) return false;
    if (schema.widget === undefined) return true;
    return false;
  }
}

// 课件 -> mcc
export enum CoursewareEvent {
  Ready = 'ready', // 课件准备完成
  SetPageIdResult = 'setPageIdResult', // 设置课件页id结果
  TransferMessageSend = 'transferMessageSend', // 中转消息发送
  CWStateChange= 'cwStateChange', // 课件状态改变
  PageComplete = 'pageComplete', // 课件页播放完成
  RecoverCWStateResult = 'recoverCWStateResult', // 恢复课件状态结果
  sendLog = 'sendLog', // 发送日志
}
// mcc -> 课件
export enum CoursewareCommand {
  SetPageId = 'setPageId', // 设置课件页，只传课件页id
  TransferMessageReceive = 'transferMessageReceive', // 中转消息接收
  RecoverCWState = 'recoverCWState',  // 恢复课件状态
  SetPageUseAble = 'setPageUseAble', // 当前页可以使用
  ResizeCW = 'onCourseWareSizeChanged', // 修改屏幕宽高
}