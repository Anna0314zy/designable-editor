// 公共接口类型地址

import { BATCH_LOG_FREQUENCY_LEVEL } from '../constants';


export { BATCH_LOG_FREQUENCY_LEVEL };
export enum Role {
    Receiver = 'receiver',
    Sender = 'sender',
}

export type FnCheckResource = (
    data: string[],
    callback: (info: Array<{ path: string; exist: boolean }>) => void
) => void;

export interface InitParam {
    startPageId?: string; // 起始页码ID,页码恢复时优先选取该页码进行恢复，不存在时取服务器存储数据恢复；
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
    localRootPath: string // 本地根目录
    introductoryLesson: boolean // 先导课
    env: string, // 环境变量 test/prod
    class_mode: string, // 课堂形态
    guid: string // 设备id
}

export interface CloudControlData {
    mccPathDefinition: any // mcc 路径云控
}

export enum INIT_STEP {
    BEGIN = 0,
    INIT = 10,
    LOADING_PROGRESS_01 = 20,
    LOADING_PROGRESS_02 = 40,
    LOADING_PROGRESS_03 = 60,
    LOADING_PROGRESS_04 = 80,
    LOADING_PROGRESS_05 = 90,
    LOADING_PROGRESS_06 = 95,
    READY = 100,
}

export const AllNotifyMessage = 'allNotifyMessage';
export const GameNotifyMessage = 'gameNotifyMessage';


export interface ERR0R_CATCH_EVENT {
    /** 捕获的报错信息 */
    message: string;
    /** 报错文件名 */
    filename: string;
    /** 报错行号 */
    lineno: number;
    /** 报错列号 */
    colno: number;
    /** 错误对象 */
    error?: any;
    /** 函数调用栈信息 */
    stack?: any;
}