/**
 * @description: native 回调管理器  课件 && native 调用mcc 全部从这个文件里接收
 * @return {*}
 */
import NativeBridge from "@/components/native-bridge/index";
import CourseBridge from "@/components/course-bridge";
import GameManager from "@/components/game-manage";
import PageManage from "@/components/page";
import { uuid } from '@/utils'

import { GameNotifyType, NotifyType } from "../native-bridge/bridge-type";
import {
  CoursewareEvent,
  SetPageIdResult,
  ResultStatus,
  MessageParam,
  PageId,
} from "../course-bridge/type";
import { PageMain, pageList, PageType } from "@/components/page/type";
import {
  HIDE_GAME,
  SET_CURRENT_PAGE,
  SET_INIT_PARAM,
  STATE_CHANGE
} from "@/components/page/const";
import {
  InitParam,
  AllNotifyMessage,
  INIT_STEP,
  CloudControlData,
  GameNotifyMessage,
} from "@/interface";
import Logger from "@/libs/logger";
import { EventEmitter } from "events";
import microApp from "@ld/micro-app";
import { cloudControlData } from "@/constants/cloudControl";
import { cloudControlDataProd } from "@/constants/cloudControlProd"
import { deepClone } from "@/utils/utils";
import { GameEvent } from "../game-manage/type";
const logger = new Logger("[service]");
export default class Service extends EventEmitter {
  public nativeBridge = NativeBridge.getNativeManager();
  public courseBridge = CourseBridge.getCourseManager();
  public pageManage = PageManage.getPageManage();
  public gameManager = GameManager.getGameManager();

  private reConnected: boolean = false

  public setPageSuccessId = "";

  // 授课端获取的学生在线人数
  public onlineNum = 0

  // 每个页的状态
  public pageStateMap = new Map();
  // 先导课是否已完全切换完成
  public introductoryEnd: boolean = false;

  // 从服务端拉取的数据
  private storeInfo = {}


  private pageChangeEnum = {
    NEXT: "next",
    Prev: "prev",
  };
  private pageChangeType: string = this.pageChangeEnum.NEXT;

  // 是否为先导课
  private isIntroductoryLesson: boolean = false;

  private originIsGame = false

  public params: any = {};

  public initRegister() {
    this.registerNativeHandler();
  }


  /**
   * @description: 注册全局方法， 端上调用
   * @return {*}
   */
  private registerNativeHandler() {
    /**
     * @description: 监听native 调用mcc
     * @return {*}
     */
    this.nativeBridge.on(
      AllNotifyMessage,
      (command: NotifyType, param: any) => {
        if (command !== NotifyType.HandleRoomItsMessage && command !== NotifyType.HandleCatalogueInfo) {
          logger.log(command, JSON.stringify(param), "app-发送的消息");
        }
        // 主动翻页时，特殊处理游戏相关逻辑
        if (command === NotifyType.SetPageId) {
          this.gameManager.onBeforeChangePage(param);
          if(this.params.role === 'receiver') {
            this.pageManage.aliLogSend({
              name: 'pomelo',
              type: 'set_page',
              option: {
                role: 'receiver',
              }
            })
          }
        }
        if (this[command]) {
          this[command](param);
        }
      }
    );

    this.nativeBridge.on(
      GameNotifyMessage,
      (command: GameNotifyType, id: string, param: any) => {
        logger.log(command, JSON.stringify(param), "app-发送给游戏的消息");
        this.onClientToGame(command, id, param);
      }
    );

    /**
     * @description: 监听课件调用mcc
     * @return {*}
     */
    this.courseBridge.on(
      AllNotifyMessage,
      (command: CoursewareEvent, param: any) => {
        if (command !== CoursewareEvent.TransferMessageSend) {
          logger.log("获取课件调用mcc 具体参数", command, param);
        }
        if (this[command]) {
          this[command](param);
        }
      }
    );

    this.gameManager.on(
      GameNotifyMessage,
      (command: any) => {
        if (GameEvent.SetNextPageId === command) {
          this.setNextPageId();
        } else if (HIDE_GAME === command) {
          this.emit(HIDE_GAME);
        }
      }
    );
  }

  // course -> mcc mcc 接收
  /**
   * @description: 课件动画或其他状态完成可以翻页消息
   * @param {*}
   * @return {*}
   */
  pageComplete() {
    // this.setNextPageId()
  }

  /**
   * @description: 课件ready 将向端上发ready信令
   * @return {*}
   */
  ready() {
    this.nativeBridge.SDKInitProgress({
      progress: INIT_STEP.LOADING_PROGRESS_05
    });
    this.nativeBridge.CourseReady();
    this.nativeBridge.getStoredData();
  }

  /**
   * @description: 返回设置pageId 结果
   * @param {*} param
   * @return {*}
   */
  async setPageIdResult(param: SetPageIdResult) {
    const { id, result } = param;
    logger.log("setPageIdResult", result);
    this.pageManage.pageChangeComplete = true
    this.originIsGame && this.emit(SET_CURRENT_PAGE, this.pageManage.currentPageInfo);
    if (result === ResultStatus.SUCCESS) {
      // 当前切页成功的id
      this.setPageSuccessId = id;
      // 授课端埋点记录
      if(this.params.role === 'sender') {
        this.pageManage.aliLogSend({
          name: 'pomelo',
          type: 'set_page',
          option: {
            role: 'sender',
            onlineNum: this.onlineNum
          }
        })
      }
      this.nativeBridge.setPageId({
        id,
        uuid: uuid()
      });
      const currentPageInfo = this.pageManage.currentPageJson();
      console.log("file: index.ts:173 ~ Service ~ setPageIdResult ~ currentPageInfo:", currentPageInfo)
      if (
        this.pageStateMap.get(id) &&
        currentPageInfo.pageType !== PageType.VIDEO_PAGE
      ) {
        logger.log(
          id,
          "this.pageStateMap---设置当前页状态信息",
          "recover 的数据",
          this.pageStateMap.get(id)
        );
        
        await this.courseBridge.recoverCWState(this.pageStateMap.get(id));
      } else if(currentPageInfo.pageType !== PageType.VIDEO_PAGE) {
        this.courseBridge.recoverCWState({
          msgQueue: [],
          uuid: uuid()
        });
        // this.recoverCWStateResult();
      } else if(!this.pageManage.pageLoadSuccess) {
        console.log('恢复视频数据', this.storeInfo)
        // 如果是视频页 而且是首次进入
        this.courseBridge.recoverCWState(this.storeInfo)
      }

      this.reConnected = true



      // 视频流数据处理
      if (currentPageInfo && currentPageInfo.mainContentStructure) {
        try {
          // 画布大小
          const VIEWPORT_SIZE = 1280;
          // 画布比例
          const VIEW_PORT_RATIO = 0.75;
          let wrapperHeight, wrapperWidth;

          // 授课端基本窗口
          const clientWidth = 1244;
          const clientHeight = 933;
          if (clientHeight / clientWidth > VIEW_PORT_RATIO) {
            wrapperWidth = clientWidth;
            wrapperHeight = wrapperWidth * VIEW_PORT_RATIO;
          } else {
            wrapperHeight = clientHeight;
            wrapperWidth = wrapperHeight / VIEW_PORT_RATIO;
          }
          const scale = wrapperWidth / VIEWPORT_SIZE;
          const mainContentStructure = JSON.parse(
            currentPageInfo.mainContentStructure
          );
          const hasCamera = mainContentStructure.pageInfo.children.find(
            (item: any) => item.componentName === "Camera"
          );
          // 如果数据中包含视频流的话
          if (hasCamera) {
    
            const children = mainContentStructure.pageInfo.children.map(
              (item: any) => {
                if (item.componentName === "Camera") {
                  return {
                    ...item,
                    props: {
                      ...item.props,
                      style: {
                        ...item.props.style,
                        width: Math.round(parseInt(item.props.style.width) * scale),
                        height:
                          Math.round(parseInt(item.props.style.height) * scale),
                        x: Math.round(parseInt(item.props.style.x) * scale),
                        y: Math.round(parseInt(item.props.style.y) * scale),
                      },
                    },
                  };
                } else {
                  return item;
                }
              }
            );
            mainContentStructure.pageInfo.children = children;
            console.log(
              mainContentStructure,
              JSON.parse(currentPageInfo.mainContentStructure),
              "视频流更改后数据以及视频流元数据"
            );
            this.nativeBridge.setPageInfo(JSON.stringify(mainContentStructure));
          } else {
            this.nativeBridge.setPageInfo(currentPageInfo.mainContentStructure);
          }
        } catch (e) {
          console.log(e, "currentPageInfo.mainContentStructure");
        }
      }
    } else {
      if(!this.pageManage.pageLoadSuccess) {
        // 首次进入切页失败埋点
        this.pageManage.aliLogSend({
          name: 'load_status',
          type: 'fail',
          message: 'setPageId error',
          option: {
            loadTime: Date.now() - window.timeStart
          }
        })
      }
    }
  }

  /**
   * @description: 告知课件当前页可以使用
   * @return {*}
   */
  async recoverCWStateResult() {
     // 获取页面中未请求的所有json
    logger.log(
      "是否首次加载",
      !this.pageManage.pageLoadSuccess,
      "当前页类型",
      this.pageManage.currentPageInfo.pageType
    );
    // 当前页是课件页是 首次渲染完成关闭loading
    if (
      !this.pageManage.pageLoadSuccess &&
      this.pageManage.currentPageInfo.pageType !== PageType.GAME_PAGE
    ) {
      logger.log("上报进度完成 关闭loading");
      this.nativeBridge.SDKInitProgress({
        progress: INIT_STEP.READY,
      });
      this.pageManage.pageLoadSuccess = true;

      const timeEnd = new Date().getTime();
      const realTime = timeEnd - window.timeStart;
      logger.log("课件加载时间", realTime, "设备为", this.params.client);


      // 业务埋点
      this.pageManage.aliLogSend({
        name: 'load_status',
        type: 'success',
        option: {
          loadTime: Date.now() - window.timeStart
        }
      })
    }
    await this.courseBridge.SetPageUseAble();
    
    // if (this.stateTimer) {
    //   console.log("清除定时器");
    //   clearInterval(this.stateTimer);
    //   this.stateTimer = null;
    //   this.setInterVal();
    // }

    // // msgQ 数据存在异步问题 添加的宏任务后执行
    let timer = setTimeout(() => {
      this.emit(STATE_CHANGE)
      clearTimeout(timer)
      timer = null
    }, 0) as any
    if (
      this.pageManage.catalogueList.length !== this.pageManage.pageList.length
    )  {
       await this.pageManage.setCoursePageInfo();
       // 设置游戏所有页数据
       this.gameManager.setGameDataByPageJson(this.pageManage.pageList);
       // 预加载下一页游戏
       this.gameManager.preloadGame();
    }
    
  }

  /**
   * @description: 消息中转如视频动画等消息
   * @return {*}
   */
  transferMessageSend(param: MessageParam) {
    console.log("课件发送过来的消息", param.msgDetail);
    
    // 视频的进度同步
    if(this.params.role === 'sender') {
      const { msgDetail } = param
      this.pageManage.aliLogSend({
        name: 'pomelo',
        type: 'play_event',
        option: {
          event: msgDetail?.payload?.event,
          onlineNum: this.onlineNum,
          role: 'sender'
        }
      })
    }
    
    this.nativeBridge.sendRoomItsMessage(param);

    this.introductoryLessonStatus(param);
  }

  /**
   * @description: 每三秒同步课件状态
   * @param {*} param
   * @return {*}
   */
  async sendCwState(param: { pageId: string; pageInfo: any, pageState: any }) {
    const currentPageId = this.pageManage.currentPageInfo.id;
    // 异常情况不进行后续逻辑
    if (!this.pageManage || !this.pageManage.currentPageInfo || !param) {
      return;
    }

    if(!this.reConnected) {
      // 未恢复时触发
      return 
    }
    if (!this.nativeBridge.courseReady) {
      logger.log("课件未ready 不接收pomelo");
      return;
    }

    // 当前页与授课端页id不一致时
    if (param && param.pageId !== currentPageId) {
      logger.log("同步课件数据", param.pageId);

      // 同步游戏心跳数据
      try {
        this.gameManager.storeData = JSON.parse(JSON.stringify(param));
      } catch (e) {
        console.warn("心跳数据同步异常", e);
      }

      // 获取当且要切换也得数据
      const currentPage = this.pageManage.catalogueList.find(
        (page) => page.id === param.pageId
      );

      // 无当页数据时
      if (!currentPage) {
        logger.warn("pageId不存在", param.pageId);
        return;
      }
      // 切页
      await this.setPageId({
        id: param.pageId,
      });
    }
    
    const msgQueue = param.pageInfo && param.pageInfo?.msgQueue as []
    if(msgQueue && msgQueue.length) {
      // 缓存当前页要恢复的数据
      this.pageStateMap.set(param.pageId, param.pageInfo);
    }

    const pageState = param.pageState
    if(pageState) {
      for (const [key, value] of Object.entries(pageState)) {
        this.pageStateMap.set(key, value);
      }
    }

    await this.setPageMapGlobalData(this.pageStateMap)
     
    // 如果当前页已经切页成功 再去调用恢复逻辑
    if (this.setPageSuccessId === param.pageId) {
      await this.courseBridge.recoverCWState(param.pageInfo);
    }
  }

  /**
   * @description: 同步游戏操作
   * @param {*} param
   */
  sendGameSyncAction(param: any) {
    this.gameManager.recvSyncData(param);
  }

  /**
   * @description: 授课端看学生的游戏
   * @param {*} param
   */
  watchScreen(param: any) {
    this.gameManager.recvWatchScreen(param);
  }

  /**
   * @description: 授课端看学生游戏时，获取当前页游戏数据
   */
  getPageGameData(param: any) {
    console.log(param);
    this.gameManager.recvGetPageGameData();
  }

  // native ->  mcc  mcc 接收

  /**
   * @description: 收到pomelo调用 传给课件或游戏
   * @return {*}
   */
  async sendRoomItsMessage(param: MessageParam) {
    console.log("学生端接收消息信息", param.msgDetail);
    const { msgDetail } = param
    this.pageManage.aliLogSend({
      name: 'pomelo',
      type: 'play_event',
      option: {
        event: msgDetail?.payload?.event,
        onlineNum: this.onlineNum,
        role: 'receiver'
      }
    })
    await this.courseBridge.transferMessageReceive(param);
  }

  // /**
  //  * @description: 断线重连
  //  * @return {*}
  //  */
  // async handleReconnected() {
  //   const storeData = await this.nativeBridge.getStoredData();
  //   console.log(storeData);
  // }

  /**
   * @description: 修改屏幕大小
   * @return {*}
   */
  onCourseWareSizeChanged(param: PageMain) {
    this.emit(SET_INIT_PARAM, { ...this.params, ...param });
    this.courseBridge.ResizeCW(param);
  }

  /**
   * @description: 获取课件目录
   * @return {*}
   */
  getCatalogueInfo(data: any) {
    logger.log('getCatalogueInfo', 'slideId:', data.slideId, 'slideVersion:',data.slideVersion)
    this.pageManage.catalogueData = data;
  }

  getCloudControl(data: CloudControlData) {
    if (!data || !data.mccPathDefinition) {
      this.pageManage.cloudPage = this.params.env === 'prod' ? cloudControlDataProd : cloudControlData;
    } else {
      this.pageManage.cloudPage = data;
    }
  }

  /**
   * @description: 向服务端获取课件信息
   * @return {*}
   */
  async getStoredData(data: any) {
    // 如果已经关闭loading storeData 不在执行
    if(this.nativeBridge.processReady) {
      logger.log('服务端拉取数据超时，不进行后续逻辑')
      return
    }

    let storeData = data;

    // 同步游戏心跳数据
    try {
      storeData = JSON.parse(data);
    } catch (e) {
      /* empty */
    }

    // 如果数据出现异常等情况
    if(!storeData) {
      this.nativeBridge.SDKInitProgress({
        progress: INIT_STEP.LOADING_PROGRESS_06
      });
      await this.setPageId({
        id: this.pageManage.catalogueList[0].id,
      });
      return
    }

    // 游戏存储服务端获取的数据
    this.gameManager.storeData = deepClone(storeData);

    // 获取服务端恢复的页面id
    const { pageId } = storeData;
    if (storeData.pageInfo) {
      storeData.pageInfo = {
        ...storeData.pageInfo,
        reconnect: true,
      };
      // 恢复课件
      this.pageStateMap.set(pageId, storeData.pageInfo);
      this.setPageMapGlobalData(this.pageStateMap)
      console.log("查看存储状态数据", this.pageStateMap);
      this.storeInfo = storeData.pageInfo
    }
    this.nativeBridge.SDKInitProgress({
      progress: INIT_STEP.LOADING_PROGRESS_06
    });
    await this.setPageId({
      id: pageId ? pageId : this.pageManage.catalogueList[0].id,
    });
    
    console.log("服务端拉取的数据上报", storeData);
    
  }

  /**
   * @description: 切页 切到指定页id
   * @return {*}
   */
  async setPageId(param: PageId) {
    console.log("setPageId------", this.pageManage.currentPageInfo.id, param);
    if (this.setPageSuccessId === param.id) {
      logger.log("页面id相同 不进行切页");
      return;
    }
    // 设置切页类型
    this.setPageChangeType(param);

    // 设置当前页信息
    const currentIndex = this.pageManage.catalogueList.findIndex(
      (page) => page.id === param.id
    );
    logger.log('切页页码为', currentIndex + 1)
    // 拉取当前页 前一页后一页数据
    const currentIndexList = [currentIndex, currentIndex + 1, currentIndex - 1];
    const currentCatalogue = this.pageManage.catalogueList.filter(
      (page, index) => page.id === param.id || currentIndexList.includes(index)
    );

    this.originIsGame = this.pageManage.currentPageInfo?.pageType === PageType.GAME_PAGE
    console.log(this.pageManage.currentPageInfo,'this.pageManage.currentPageInfo')
    // 设置当前页信息
    this.pageManage.currentPageInfo = this.pageManage.catalogueList.find(
      (page) => page.id === param.id
    );

    if (!this.pageManage.currentPageInfo) {
      logger.warn("pageId 不存在 切换到第一页", param);
      param.id = this.pageManage.catalogueList[0].id;
      this.pageManage.currentPageInfo = this.pageManage.catalogueList[0];
    }

    // 获取下一页预渲染

    // 重新向服务端发送数据
    // this.cwStateChange(true);

    // 切页前 清空游戏数据
    microApp.setGlobalData({
      gameSyncData: null,
    });

    this.pageManage.pageChangeComplete = false
    const { nextPageId, prePageId } = this.pageManage
    //  json 全部请求完成，只进行切页逻辑
    if (
      this.pageManage.catalogueList.length === this.pageManage.pageList.length
    ) {
      logger.log("切页 所有页json请求均完成",this.pageManage.currentPageInfo);
      !this.originIsGame && this.emit(SET_CURRENT_PAGE, this.pageManage.currentPageInfo);
      // 游戏切页
      await this.courseBridge.setPageId({ ...param, pre: prePageId(), next: nextPageId(),  trend: this.pageChangeType});
    } else {
      // json 未请求完成 进行请求逻辑
      // 请求当前页json
      const res = await this.pageManage.getCourseJson(currentCatalogue);
      // 设置游戏数据，并调用游戏切页接口
      this.gameManager.setGameDataByPageJson(res as pageList[]);
      !this.originIsGame && this.emit(SET_CURRENT_PAGE, this.pageManage.currentPageInfo);
      await this.pageManage.setGlobalData(res);
      // 切页
      await this.courseBridge.setPageId({ ...param, pre: prePageId(), next: nextPageId(),  trend: this.pageChangeType});
    }
  }

  /**
   * @description: 设置当前切页类型 上翻页或下翻页
   * @param {PageId} param
   * @return {*}
   */
  async setPageChangeType(param: PageId) {
    const id = this.pageManage.currentPageId();
    if (!id) {
      this.pageChangeType = this.pageChangeEnum.NEXT;
      return;
    }
    const currentIndex = this.pageManage.catalogueList.findIndex(
      (page) => page.id === id
    );
    const changeIndex = this.pageManage.catalogueList.findIndex(
      (page) => page.id === param.id
    );
    if (currentIndex > changeIndex) {
      this.pageChangeType = this.pageChangeEnum.Prev;
    } else {
      this.pageChangeType = this.pageChangeEnum.NEXT;
    }
  }

  /**
   * @description: 根据切页类型获取下一页pageId 作为预渲染id
   * @param {PageId} param
   * @return {*}
   */
  async getPreLoadPageId(param: PageId) {
    let preloadId = "";
    try {
      const currentIndex = this.pageManage.catalogueList.findIndex(
        (page) => page.id === param.id
      );
      if (this.pageChangeType === this.pageChangeEnum.NEXT) {
        // 下翻页
        this.pageManage.catalogueList[currentIndex + 1] &&
          (preloadId = this.pageManage.catalogueList[currentIndex + 1].id);
      } else {
        // 上翻页
        this.pageManage.catalogueList[currentIndex - 1] &&
          (preloadId = this.pageManage.catalogueList[currentIndex - 1].id);
      }
      return preloadId;
    } catch (e) {
      return "";
    }
  }

  /**
   * @description: 课件状态改变
   * @return {*}
   */
  cwStateChange(isOnlyStore?: boolean) {
      this.emit(STATE_CHANGE, isOnlyStore)
    // 是否为切页不上报服务端而不是课件返回状态为空对象
    // const isOnlyStoreForPage = typeof isOnlyStore === "boolean";
    // if (this.stateTimer) {
    //   console.log("状态发生改变，清除定时器", microApp.getGlobalData());
    //   clearInterval(this.stateTimer);
    //   this.stateTimer = null;
    //   this.setInterVal(isOnlyStoreForPage);
    // }
    if(this.params.role === 'sender') {
      this.pageManage.aliLogSend({
        name: 'pomelo',
        type: 'animate',
        option: {
          role: 'sender'
        }
      })
      this.nativeBridge.animateChange()
    }
    
    
  }

  /**
   * @description: 监听端上发给游戏的消息
   * @param {GameNotifyType} command
   * @param {string} id
   * @param {any} param
   */
  onClientToGame(command: GameNotifyType, id: string, param: any) {
    this.gameManager.recvClientToGame(command, id, param);
  }

  /**
   * @description: 获取初始话数据
   * @param {InitParam} param
   * @return {*}
   */
  async getInitParam(param: InitParam) {
    this.params = param;
    this.pageManage.params = param;
    this.gameManager.initParams = param;

    this.isIntroductoryLesson = this.params.introductoryLesson;
    this.emit(SET_INIT_PARAM, param);
    microApp.setGlobalData({
      initParam: param,
    });

    window.mccEnv = param.env || 'test'
  }

  /**
   * @description: 先导课视频播放结束状态处理
   * @return {*}
   */
  introductoryLessonStatus(param: MessageParam) {
    const { msgDetail } = param;
    // 视频状态结束时 切换下一页
    if (
      msgDetail.type === "playerEvent" &&
      msgDetail.payload.event === "ended"
    ) {
      this.setNextPageId();
    }
    // if (
    //   msgDetail.type === "playerEvent" &&
    //   msgDetail.payload.event === "play"
    // ) {
    //   if (this.isIntroductoryLesson) {
    //     this.nativeBridge.visibilityNavBar({
    //       visibility: false,
    //     });
    //   }
    // }
  }

  /**
   * @description: 切换到下一页 暂时只有先导课mcc会执行
   * @return {*}
   */
  setNextPageId() {
    // 若为先导课
    if (this.isIntroductoryLesson) {
      // 获取下一页id
      const nextPageId = this.pageManage.nextPageId();
      if (nextPageId) {
        this.setPageId({
          id: nextPageId,
        });
      } else {
        console.log("先导课到最后一页点击下一页");
        this.introductoryEnd = true;
        this.nativeBridge.coursePlayOver();
      }
    }
  }


  /**
   * @description: map 转换为 object
   * @param {Map} map
   * @param {*} V
   * @return {*}
   */
  mapToObject<K extends string | number | symbol, V>(map: Map<K, V>): Record<K, V> {
    const obj: Record<K, V> = {} as Record<K, V>;
    map.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  /**
   * @description: 动画的数据存储
   * @return {*}
   */
  setPageMapGlobalData<K extends string | number | symbol, V>(map: Map<K, V>): Promise<any> {
    return new Promise(resolve => {
      const pageObject = {
        pageState: this.mapToObject(map)
      }
      microApp.forceSetGlobalData(pageObject, resolve)
    })
    
  }


  /**
   * @description: 发送阿里云业务日志
   * @param {any} param
   * @return {*}
   */
  sendLog(param: any) {
    this.pageManage.aliLogSend(param)
  }


  /**
   * @description: 获取学生端在线人数
   * @return {*}
   */
  getOnlineNum(param: {num: number}) {
    this.onlineNum = param.num
  }


  /**
   * @description: 学生端接收动画发生改变
   * @return {*}
   */
  animateChange() {
    console.log('动画改变')
    this.pageManage.aliLogSend({
      name: 'pomelo',
      type: 'animate',
      option: {
        role: 'receiver'
      }
    })
  }
}
