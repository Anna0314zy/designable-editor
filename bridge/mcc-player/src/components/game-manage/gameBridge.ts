import { EventEmitter } from 'events';
import microApp from '@ld/micro-app'
import { GameCommand, GameEvent } from './type'
import GameManager from '../game-manage';
import NativeBridge from '../native-bridge/index';
import { GameNotifyType, NotifyType, PomeloMessage, PostTeacherPomeloMessage } from '../native-bridge/bridge-type';
import { GameNotifyMessage, INIT_STEP, InitParam, Role } from '@/interface';
import PageManage from '../page';
import { SET_STORE_DATA } from '../page/const';
import Logger from '@/libs/logger';
import { PageType } from '../page/type';
import { PageId } from '../course-bridge/type';

const logger = new Logger("[GameBridge]");

// 游戏启动时找mcc要的其他参数
export interface IGameStartExtraData {
  gameState?: string,  // 游戏状态：pause 暂停游戏；resume 恢复游戏
  fps?: number,  // 游戏的fps
}

export default class GameBridge extends EventEmitter {
  public nativeBridge = NativeBridge.getNativeManager();
  public pageManager = PageManage.getPageManage();

  public initParams!: InitParam;
  public interactInfo: any = null; // 互动信息
  public storeData: any = null; // 存储在服务端的心跳数据
  public gameUrl: string = ''; // 游戏地址
  public gameFrameDone: boolean = false; // 游戏框架是否加载完成
  
  private isBeWatched = false; // 是否在被老师端查看

  // 游戏启动时找mcc要的其他参数
  public gameStartExtraData: IGameStartExtraData = {};

  public readonly syncDataKey = 'gameLocalSyncData_';

  constructor() {
    super()
    this.addEventListener()
  }

  addEventListener() {
    (window as any)['cocosGameMessage'] && (window as any)['cocosGameMessage'].on('cocosToMcc', this.handleGetData.bind(this), this);
  }

  sendMessageToGame(data: any) {
    logger.log('sendMessageToGame', `data: ${JSON.stringify(data || {})}`);
    const cocosGameMessage = (window as any)['cocosGameMessage'];
    if (cocosGameMessage) {
      cocosGameMessage.dispatch('mccToCocos', data);
    }
  }

  /**
   * @description: 游戏发送给mcc 统一处理器
   */
  public handleGetData(e: any) {
    const gameManager = GameManager.getGameManager();
    const eventName = e?.eventName;
    const data = e?.data;
    const callback = e?.callback;
    // console.log('============== 游戏发送给mcc消息 eventName: ', eventName);
    switch (eventName) {
      // 主包加载完成
      case GameEvent.RequestMainGameInitDone:
        logger.log('游戏发送给mcc消息', `eventName: ${eventName}, data: ${data}`);
        const params = gameManager.getGameUrlParams();
        callback && callback(params);
        // if (this.pageManager.currentPageInfo?.pageType === PageType.GAME_PAGE && !this.pageManager.pageLoadSuccess) {
        //   this.nativeBridge.SDKInitProgress({
        //       progress: INIT_STEP.LOADING_PROGRESS_05
        //   });
        // }
        break;
      // 框架加载完成
      case GameEvent.RequestFrameGameInitDone:
        logger.log('游戏发送给mcc消息', `eventName: ${eventName}, data: ${data}`);
        this.gameFrameDone = true;
        gameManager.changeGamePage();
        callback && callback({ msg: 'success' });
        break;
      // 交互游戏同步消息
      case GameEvent.SendSyncData:
        this.onGameSyncData(e);
        break
      /**游戏开始 */
      case GameEvent.RequestGameStart:
        logger.log('游戏发送给mcc消息', `eventName: ${eventName}, data: ${data}`);
        const startData = this.getGameStartResultData();
        callback && callback(startData);
        break
      case GameEvent.RequestGameToClient:
        logger.log('游戏发送给mcc消息', `eventName: ${eventName}, data: ${data}`);
        this.requestGameToClient(e?.data?.command, e?.data?.param);
        break
      case GameEvent.SetNextPageId:
        logger.log('游戏发送给mcc消息', `eventName: ${eventName}, data: ${data}`);
        this.emit(GameNotifyMessage, GameEvent.SetNextPageId);
        break;
      case GameEvent.GetInitParam:
        logger.log('游戏发送给mcc消息', `eventName: ${eventName}, data: ${data}`);
        const initParam = this.getInitParam();
        callback && callback(initParam);
        break;
      case GameEvent.EventTracking:
        this.pageManager.aliLogSend(data);
    }
  }

  /**
   * @description: 游戏发出的同步数据
   * @param {*} param
   */
  onGameSyncData(param: any) {
    const data = param?.data;
    const eventName = param?.eventName;
    if (!data) {
      return;
    }

    const actionList: any[] = data.actions || [];

    // 心跳信息（如果有多个，只取最后一个）
    const heartAction = actionList.reduceRight((foundItem, item) => {
      return foundItem || (item.eventName === 'ON_HEART_BREAK' ? item : null);
    }, null);
    const syncData = heartAction?.syncData;

    // 如果是老师端，需要将心跳数据存储在服务端；如果是学生端，且被授权互动，需要将心跳数据存储在本地
    if (syncData) {
      if (this.initParams.role === 'sender') {
        microApp.setGlobalData({ gameSyncData: syncData });
        // 立即向服务器存储心跳数据
        this.emit(GameNotifyMessage, SET_STORE_DATA);
        // 更新 storeData
        this.updateGameStoreData(syncData);
      }
      else if (this.isInteract()) {
        this.setLocalSyncData(this.getCurInteractId(), syncData);
      }
    }

    // 将自己的操作数据返回给游戏(自己不接收自己的心跳，只接受操作数据)
    const ownData = { ...data };
    // 剔除心跳的操作消息
    const actionsExcludeHeart = actionList.filter(item => item.eventName !== 'ON_HEART_BREAK');
    ownData.actions = actionsExcludeHeart;

    // 将剔除心跳的数据发给自己
    this.sendMessageToGame({ eventName: GameCommand.RecvSyncData, data: ownData });

    // 通过pomelo将操作消息广播出去(只有老师会发广播)
    if (this.initParams.role === 'sender') {
      this.nativeBridge.sendGameSyncAction(param, PomeloMessage);
    }

    // 被授权的学生如果被授课端查看，需要把同步消息发送给老师
    if (this.initParams.role !== 'sender' && this.isInteract() && this.isBeWatched) {
      this.nativeBridge.sendGameSyncAction(param, PostTeacherPomeloMessage, 'watchScreen');
    }
  }

  /**
   * @description: 接收到pomelo广播的游戏同步数据
   * @param {*} param
   */
  recvSyncData(param: any) {
    const data = param?.data;
    if (!data) {
      return;
    }

    // 如果有心跳数据，更新 storeData
    const actionList: any[] = data.actions || [];
    const heartAction = actionList.reduceRight((foundItem, item) => {
      return foundItem || (item.eventName === 'ON_HEART_BREAK' ? item : null);
    }, null);
    const syncData = heartAction?.syncData;
    if (syncData) {
      this.updateGameStoreData(syncData);
    }

    // 老师或者被授权互动的学生，不接收广播的游戏同步数据
    if (this.initParams.role !== 'sender' && !this.isInteract()) {
      this.sendMessageToGame({ eventName: GameCommand.RecvSyncData, data });
    }
  }

  /**
   * @description: 透传端上发给游戏的消息
   */
  recvClientToGame(command: GameNotifyType, id: string, param: any) {
    // 端上发给游戏的消息，需要mcc保存或处理的
    logger.log('端上发给游戏的消息', `command: ${command}, param: ${JSON.stringify(param)}`);
    switch(command) {
      // 发起/取消互动的接口需要mcc处理一下，不能直接透传
      case GameNotifyType.OnInteractAction:
        this.onInteractAction(param);
        return;
      case GameNotifyType.PauseOrResumeGame:
        this.gameStartExtraData.gameState = param.action;
        break;
      case GameNotifyType.SetGameFPS:
        this.gameStartExtraData.fps = param.fps;
        break;
    }

    const data = { eventName: command, id, data: param };
    this.sendMessageToGame(data);
  }

  /**
   * @description: 开始/取消 
   * @param param 
   */
  recvWatchScreen(param: any) {
    logger.log('授课端看学生游戏 recvWatchScreen', `param: ${param}`);
    this.isBeWatched = 'start' === param?.action;
    const data = { eventName: NotifyType.WatchScreen, id: '', data: param };
    this.sendMessageToGame(data);
  }

  /**
   * @description: 授课端看学生游戏时，端上请求游戏数据
   * @param param 
   */
  recvGetPageGameData() {
    logger.log('授课端看学生游戏 端上请求游戏数据 recvGetPageGameData');
    const gameManager = GameManager.getGameManager();
    const data = gameManager.getWatchScreenData();
    this.nativeBridge.sendWatchScreenData(data);
  }

  /**
   * @description: 透传游戏发给端上的消息
   */
  requestGameToClient(command: string, param: any) {
    if (command) {
      this.nativeBridge.sendGameToClient(command, param);
    }
  }

  /**
   * @description: 游戏当前页是否发起了互动
   */
  isInteract() {
    const currentPageId = this.pageManager.currentPageInfo.id;
    const interactAction = (this.interactInfo && this.interactInfo.interactData?.data?.pageId === currentPageId) ? this.interactInfo : null;
    const isInteract = interactAction?.interactData?.command === 'start';
    return isInteract;
  }

  /**
   * @description: 获取当前的互动id
   */
  getCurInteractId() {
    const currentPageId = this.pageManager.currentPageInfo.id;
    const interactAction = (this.interactInfo && this.interactInfo.interactData?.data?.pageId === currentPageId) ? this.interactInfo : null;
    const interactId = interactAction?.interactData?.data?.interactId || '';
    return interactId;
  }

  /**
   * 更新 storeData
   * @param syncData 
   */
  updateGameStoreData(syncData: any) {
    const currentPageId = this.pageManager.currentPageInfo.id;
    if (!this.storeData) {
      this.storeData = {};
    }
    if (!this.storeData.pageInfo) {
      this.storeData.pageInfo = {};
    }
    this.storeData.pageId = currentPageId;
    this.storeData.pageInfo.gameSyncData = syncData;
  }

  /**
   * 发起互动、取消互动时mcc需要存一下互动信息，此时游戏可能未加载完成，游戏加载完成后会来获取这个信息
   * mcc本地没有当前页的互动信息或互动信息为取消互动，且该条消息是取消互动，就不给游戏透传了
   * @param param 
   */
  onInteractAction(param: any) {
    const isInteract = param?.interactData?.command === 'start';
    const currentPageId = this.pageManager.currentPageInfo.id;
    const oldInfo = (this.interactInfo && this.interactInfo.interactData?.data?.pageId === currentPageId) ? this.interactInfo : null;

    // 上报埋点
    this.pageManager.aliLogSend({
      name: 'mcc_interact',
      act: param?.interactData?.command,
      interact_id: param?.interactData?.data?.interactId,
      option: {
        page_id: currentPageId,
        type:'replay'
      },
      desc: isInteract ? 'mcc互动开始' : 'mcc互动结束'
    });

    if ((oldInfo || isInteract) && (!oldInfo || oldInfo?.interactData?.data?.interactId !== param?.interactData?.data?.interactId || oldInfo?.interactData?.command !== param?.interactData?.command)) {
      let syncData =  null;
      if (isInteract) {
        syncData = this.getLocalSyncData(param?.interactData?.data?.interactId);
      }
      else {
        syncData = (this.storeData && this.storeData.pageId === currentPageId) ? this.storeData.pageInfo?.gameSyncData : null;
      }

      const data = { eventName: GameNotifyType.OnInteractAction, data: { interactAction: param, syncData } };
      this.sendMessageToGame(data);
    }
    this.interactInfo = param;

    if (!isInteract) {
      this.clearLocalSyncData();
    }
  }

  getGameStartResultData() {
    const currentPageId = this.pageManager.currentPageInfo.id;
    const interactAction = (this.interactInfo && this.interactInfo.interactData?.data?.pageId === currentPageId) ? this.interactInfo : null;
    const isInteract = this.isInteract();
    const isMaster = this.initParams.role === 'sender' || isInteract;
    let syncData =  null;

    // 互动状态取本地的心跳数据；非互动状态取服务端的心跳数据
    if (isInteract) {
      syncData = this.getLocalSyncData(this.getCurInteractId());
    }
    else {
      syncData = (this.storeData && this.storeData.pageId === currentPageId) ? this.storeData.pageInfo?.gameSyncData : null;
    }
    const data = { isMaster, syncData, interactAction, extraData: this.gameStartExtraData };

    return data;
  }

  setLocalSyncData(interactId: string, syncData: any) {
    if (!interactId) {
      return;
    }

    const key = `${this.syncDataKey}${interactId}_${this.initParams?.userId}`;
    if (syncData) {
      window.localStorage.setItem(key, JSON.stringify(syncData));
    }
    else {
      window.localStorage.removeItem(key);
    }
  }

  getLocalSyncData(interactId: string) {
    if (!interactId) {
      return null;
    }

    const syncData = window.localStorage.getItem(`${this.syncDataKey}${interactId}_${this.initParams?.userId}`);
    return syncData ? JSON.parse(syncData) : null;
  }

  clearLocalSyncData() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.syncDataKey)) {
          localStorage.removeItem(key);
      }
    }  
  }

  getInitParam() {
    return this.initParams;
  }

  // 主动翻页，调用 setPageId 之前的处理
  onBeforeChangePage(param: PageId) {
    if (this.pageManager.currentPageInfo.id === param.id ) {
      return;
    }

    // 清除互动状态 (翻页前一般会收到取消互动的消息，这里作个兜底)
    if (this.isInteract()) {
      this.interactInfo = null;
    }
  }
}