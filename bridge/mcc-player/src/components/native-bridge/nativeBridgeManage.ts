/* eslint-disable */
// @ts-nocheck
import { EventEmitter } from 'events';
import CallPromisify from '../../libs/call-promisify';
import {
  NotifyType,
  CommandType,
  OnEvent,
  PomeloMessage,
  OnPomelo,
  GameNotifyType,
  PostTeacherPomeloMessage
} from './bridge-type';
import { AllNotifyMessage, GameNotifyMessage, INIT_STEP } from '@/interface'
import { getUrlParams } from '@/utils'
import Logger from '@/libs/logger';
const logger = new Logger('[nativeBridge]');
declare global {
  interface Window {
    webkit: unknown;
    jsHandler: unknown;
    aliyun: unknown
  }
}

export default class NativeBridge extends EventEmitter {
  constructor() {
    super();
    this.addMessageListener();
  }

  // promise函数 监听向端索要数据，消息是否成功返回设置超时时间
  private callPromisify = new CallPromisify();
  // 来源 app/web
  private isNative = getUrlParams(location.href,'from') === 'app'
  private isWeb = getUrlParams(location.href,'from') === 'web'
  private messageId = 0;

  public courseReady = false

  // process 100 已经关闭loading
  public processReady = false


  //  消息id
  private getId() {
    return `${++this.messageId}`;
  }

  // 监听native/web 发送过来的消息
  private addMessageListener() {
    if(this.isWeb){
      window.removeEventListener('message', event => this.handleMessage(event.data))
      window.addEventListener('message', event => this.handleMessage(event.data))
    } else {
      window.jsHandler = this.handleMessage.bind(this);
    } 
  }

  /**
   * @description: 接收消息后处理
   * @param {any} msg
   * @return {*}
   */
  private handleMessage(msg: any) {
    let msgObj = msg;
    try {
      msgObj = JSON.parse(msg);
    } catch (e) {
      // logger.warn('数据格式不需要转化为json');
    }
    const {type, data = {}} = msgObj
    const { id, command, param } = data;
    switch (type) {
      case OnEvent:  
        if (id) {
          this.callPromisify.resolve(id, param);
        }
        this.notifyMessage(command, param);
        //  处理端上发给游戏的消息
        if (Object.values(GameNotifyType).includes(command)) {
          this.gameNotifyMessage(command, id, param);
        }
        break
      case OnPomelo:  
      this.notifyMessage(command, param)
      break
    }
    
  }

  /**
   * @description: pomelo通信
   * @return {*}
   */
  private pomeloNative(command: CommandType, param: any) {
    const msg = {
      command: command,
      param
    };
    this.notifyNative(PomeloMessage, msg, true);
  }

  /**
   * @description: 学生只发给授课端的pomelo通信
   */
  private teacherPomeloNative(command: CommandType, param: any, businessType?: string) {
    const msg = {
      command: command,
      param
    };
    if (businessType) {
      msg['businessType'] = businessType;
    }
    this.notifyNative(PostTeacherPomeloMessage, msg, true);
  }

  /**
   * @description: 消息传递 处理事件
   * @param {NotifyType} command
   * @param {any} param
   * @return {*}
   */
  private notifyMessage(command: NotifyType, param: any) {
    this.emit(AllNotifyMessage, command, param);
  }

  /**
   * @description: 透传端上发给游戏的消息
   * @param {GameNotifyType} command
   * @param {string} id
   * @param {any} param
   */
  private gameNotifyMessage(command: GameNotifyType, id: string, param: any) {
    this.emit(GameNotifyMessage, command, id, param);
  }

  /**
   * @description: 调用客户端方法，不需要端上在返回数据
   * @param {CommandType} cmd
   * @param {any} param
   * @return {*}
   */
  private notifyNative(cmd: CommandType, param: any, isPomelo?:boolean = false) {
    const msg = {
      command: cmd,
      param,
    };
    this.sendToNative(msg, isPomelo);
  }

  /**
   * @description: 调用客户端方法，需要端上返回mcc索要的数据
   * @return {*}
   */
  private async callNative(
    cmd: CommandType,
    param: any,
    timeout = 3000,
    timerCallback
  ): Promise<void> {
    const id = this.getId();
    const msg = {
      command: cmd,
      param,
      id
    };
    this.sendToNative(msg);
    const res = await this.callPromisify
      .record(id, timeout, `${cmd} ${id} timeout`, timerCallback)
      .catch((e) => {
        throw new Error(e);
      });
    return res
  }

  /**
   * @description: 发送消息给客户端
   * @param {any} msg
   * @return {*}
   */
  private sendToNative(msg: any, isPomelo?:boolean = false) {
      let data = {}
      if(isPomelo) {
        data = {
          type: msg.command,
          data: msg.param
        }
      } else {
        data = {
          type: 'onEvent',
          data: msg
        }
        logger.log('调用app的event数据', msg)
      }
      if (window.htHammer && typeof window.htHammer['nativeHandler'] === 'function') {
        window.htHammer['nativeHandler'](JSON.stringify(data));
      } else if (window.webkit && window.webkit['messageHandlers']) {
        window.webkit['messageHandlers']['nativeHandler'].postMessage(data);
      } else if(this.isWeb) {
        window.parent.postMessage(data, '*')
      } else {
        console.log('app接口调用异常')
      }
  }

  /**
   * @description: 初始化获取基本信息
   * @return {*}
   */
  public getInitParam() {
    const cmd = CommandType.GetInitParam;
    return this.callNative(cmd, {});
  }


  /**
   * @description: 像服务端存储数据
   * @param {*} key
   * @param {*} value
   * @param {*} callback
   * @return {*}
   */
  public storeData(param): void {
    const cmd = CommandType.StoreData;
    this.notifyNative(cmd, param);
  }


  /**
   * @description: 当前页面状态已完成 可以进行翻页
   * @param {*} param
   * @return {*}
   */
  public pageComplete(param) {
    const cmd = CommandType.PageComplete;
    this.notifyNative(cmd, param);
  }
  
  /**
   * @description: 发送课件数据
   * @param {*} param
   * @return {*}
   */
  public sendCwState(param) {
    const cmd = CommandType.SendCwState;
    this.pomeloNative(cmd, param);
  }

  /**
   * @description: 游戏同步数据
   * @param {*} param
   */
  public sendGameSyncAction(param: any, pomeloType: string, businessType?: string) {
    const cmd = CommandType.SendGameSyncAction;
    if (PomeloMessage === pomeloType) {
      this.pomeloNative(cmd, param);
    }
    else if (PostTeacherPomeloMessage === pomeloType) {
      this.teacherPomeloNative(cmd, param, businessType);
    }
  }

  /**
   * @description: mcc返回给端上当前页游戏数据
   * @param {*} param
   */
  public sendWatchScreenData(param: any) {
    const cmd = CommandType.GetPageGameData;
    this.notifyNative(cmd, param);
  }

  /**
   * @description: 透传游戏发送给端的消息
   * @param command 
   * @param param 
   */
  public sendGameToClient(command: string, param: any) {
    this.notifyNative(command, param);
  }  

  /**
   * @description: 拉取服务端全部数据
   * @return {*}
   */
  public async getStoredData(): void {
    const cmd = CommandType.GetStoredData;
    this.callNative(cmd, {}, 5000, () => {
      this.notifyMessage(cmd, {})
    });
  }

  /**
   * @description: 获取课件目录
   * @return {*}
   */
  public async getCatalogueInfo(): void {
    const cmd = CommandType.GetCatalogueInfo;
    return this.callNative(cmd, {});
  }


  public async getCloudControl(): void {
    const cmd = CommandType.GetCloudControl;
    return this.callNative(cmd, {});
  }

  /**
   * @description: 发送its消息
   * @param {*} itsMessage
   * @param {number} priority
   * @return {*}
   */
  public sendRoomItsMessage(itsMessage): void {
    const cmd = CommandType.SendRoomItsMessage;
    this.pomeloNative(cmd, itsMessage);
  }


  /**
   * @description: 动画状态发生改变
   * @return {*}
   */
  public animateChange(): void {
    const cmd = CommandType.AnimateChange;
    this.pomeloNative(cmd);
  }

  /**
   * @description: 切页
   * @param {*} data
   * @return {*}
   */
  public setPageId(data): void {
    const cmd = CommandType.SetPageId;
    this.pomeloNative(cmd, data);
  }



  /**
   * @description: 课件与判断 mounted
   * @return {*}
   */
  public CourseReady() {
    const cmd = CommandType.CourseReady;
    this.notifyNative(cmd);
    this.courseReady = true
  }

  /**
   * @description: 先导课所有页切页结束后调用
   * @return {*}
   */
  public coursePlayOver() {
    const cmd = CommandType.CoursePlayOver;
    this.notifyNative(cmd);
  }

  /**
   * @description: 控制导航栏显示隐藏
   * @return {*}
   */
  public visibilityNavBar(data) {
    const cmd = CommandType.VisibilityNavBar
    this.notifyNative(cmd, data);
  }


  /**
   * @description: sdk加载进度
   * @param {*} data
   * @return {*}
   */
  public SDKInitProgress(data) {
    if(this.processReady) {
      logger.log('已完成100% 不进行重新加载进度')
      return
    }
    if(data.progress === INIT_STEP.READY) {
      this.processReady = true
    }


    logger.log('process',data.progress, Date.now())
    const cmd = CommandType.SDKInitProgress;
    this.notifyNative(cmd, data);
  }


  public setPageInfo(data) {
    const cmd = CommandType.GetPageInfo;
    this.notifyNative(cmd, data);
  }
}