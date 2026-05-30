/**
 * @description: 在这个文件夹 this中可以获得所有属性
 * @return {*}
 */
import Server from '@/components/service'
import { Dispatch, SetStateAction } from 'react'
import microApp from '@ld/micro-app'
import { areObjectsEqual, uuid, isRemoteResourceExist, cleanObject } from '@/utils'
import {  PageType } from '@/components/page/type'
import { INIT_STEP, BATCH_LOG_FREQUENCY_LEVEL, ERR0R_CATCH_EVENT, GameNotifyMessage } from '@/interface'
import Logger from '@/libs/logger';
import xesLogger from '@/libs/xesLogger';
// import aliLogger from '@ld/ali-logger'
import config from "../../../package.json";
import { SET_STORE_DATA, STATE_CHANGE } from '../page/const'
const RECOVER_TIME = 3000
const logger = new Logger('[player]');

// declare global {
//     interface Window {
//       aliLog: any
//     }
//   }
export default class mccPlay extends Server {
    public setCourseUrl!: Dispatch<SetStateAction<string>> 
    public setGameUrl!: Dispatch<SetStateAction<string>>
    public isSender:boolean = false;
    public oldStoreData:unknown
    public uuid:string = uuid()

    public stateTimer: any = null;
    constructor() {
        super()
        this.initRegister()
    }

    public initRegister() {
        super.initRegister();

        this.gameManager.on(
            GameNotifyMessage,
            (command: any) => {
                if (SET_STORE_DATA === command) {
                    if(this.isSender) {
                        this.onSetStoreData(true)
                    }
                }
            }
        )
        this.on(STATE_CHANGE, (isOnlyStore?) => {
            this.onSetStoreData(isOnlyStore)
        })
    }

    /**
     * @description: 获取初始化参数
     * @param {Dispatch} setCourseUrl 设置课件地址
     * @param {Dispatch} setGameUrl 设置游戏地址
     * @return {*}
     */
    async getInitParams(setCourseUrl: Dispatch<SetStateAction<string>>, setGameUrl: Dispatch<SetStateAction<string>>) {
        logger.log('init')
        this.reportInitProgress(INIT_STEP.BEGIN)
        this.setCourseUrl = setCourseUrl
        this.setGameUrl = setGameUrl

        // 初始化initParam
        await this.nativeBridge.getInitParam()
        this.reportInitProgress(INIT_STEP.INIT)
        await this.initLogger()
        logger.log("from end:init", this.params, "mcc version is", config.version);
        await this.addErrorListener()
        // 获取课件目录
        await this.nativeBridge.getCatalogueInfo()
        this.reportInitProgress(INIT_STEP.LOADING_PROGRESS_01)

        // 获取云控配置
        await this.nativeBridge.getCloudControl()
        this.reportInitProgress(INIT_STEP.LOADING_PROGRESS_02)

         // 目录数据处理 
        await this.pageManage.setCatalogueData()
        this.reportInitProgress(INIT_STEP.LOADING_PROGRESS_03)

        // 初始化游戏数据
        await this.gameManager.initData();
        this.reportInitProgress(INIT_STEP.LOADING_PROGRESS_04)

        // 设置url
        this.setUrl()
    }

    /**
     * @description: 发送mcc进度
     * @param {INIT_STEP} step
     * @return {*}
     */
    public reportInitProgress(step: INIT_STEP) {
        this.nativeBridge.SDKInitProgress({
            progress: step
        })
    }

    /**
     * @description: 设置课件url、 游戏url
     * @return {*}
     */
    setUrl() {
        // 设置接收端还是发送端
        this.isSender = this.params.role === 'sender'

        // 课件中存在游戏 需要创建主包url
        if(this.pageManage.catalogueList.some(item => item.pageType === PageType.GAME_PAGE)) {
            const currentUrl = location.href;
            let gameUrl = currentUrl.replace('index.html', 'cocos.html')
            if(location.href.includes('localhost')) {
                gameUrl = 'http://localhost:5500/bridge/mcc-player/dist/1.0.0/cocos.html'
              }
            this.setGameUrl(gameUrl) 
            this.gameManager.gameUrl = gameUrl
        }

        // 设置课件地址
        this.setSlideUrl()

        // 三秒同步
        this.setInterVal()    
    }

    /**
     * @description: 授课端设置进行三秒同步
     * @return {*}
     */
    setInterVal ()  {
        if(this.isSender) {
            this.stateTimer = setInterval(() => {
                this.onSetStoreData()
            }, RECOVER_TIME)
        }
    }

    /**
     * @description: 同步数据 存储服务端
     * @param {boolean} isOnlyStore 是否只进行服务端存储
     * @return {*}
     */
    async onSetStoreData(isOnlyStore?:boolean) {
        if(!this.isSender) {
            const globalData = microApp.getGlobalData()
            const msgQueue = globalData?.msgQueue as []
            const currentPageInfo = this.pageManage.currentPageInfo 
            const pageInfo = {
                uuid: uuid(),
                msgQueue: globalData?.msgQueue,
            }
            if(msgQueue && msgQueue.length) {
                this.pageStateMap.set(currentPageInfo.id, pageInfo)
                this.setPageMapGlobalData(this.pageStateMap)
            }
        }
        const globalData = microApp.getGlobalData()
        if(globalData && (globalData.msgQueue || globalData.gameSyncData)) {                   
            const currentPageInfo = this.pageManage.currentPageInfo 
            // 若出现一些异常 没有当前页面信息时 不进行同步上报
            if(!currentPageInfo) {
                logger.log('未找到当前页信息')
                return
            }
            const storeData = {
                pageId: currentPageInfo.id,
                pageInfo: {
                    msgQueue: globalData.msgQueue,
                    gameSyncData: globalData.gameSyncData,
                    uuid: this.uuid
                },
                pageType: currentPageInfo.pageType,
            }
            // 数据不同时 创建新的uuid 发送给服务端 存储数据
            if(!areObjectsEqual(this.oldStoreData, storeData)) {
                logger.log('数据不同')
                console.log(this.oldStoreData, storeData)
                this.uuid = uuid();
                storeData.pageInfo.uuid = this.uuid
                this.oldStoreData = storeData

                // 如果是先导课 已经切页结束后 不向服务器发送
                if(!this.introductoryEnd) {
                    this.nativeBridge.storeData(storeData)
                } else {
                    logger.log('先导课已结束, 清除定时器不向服务端发送数据')
                    clearInterval(this.stateTimer)
                    this.stateTimer = null
                }
                
                const msgQueue = storeData.pageInfo && storeData.pageInfo?.msgQueue as []
                if(msgQueue && msgQueue.length) {
                    this.pageStateMap.set(currentPageInfo.id, storeData.pageInfo)
                    await this.setPageMapGlobalData(this.pageStateMap)
                }
                console.log('this.pageStateMap--',this.pageStateMap )
            }

            // 先导课不调用 切页状态变更等不调用 
            if(!isOnlyStore && !this.params.introductoryLesson) {
                // 发送给客户端进行数据同步
                const prePageId = this.pageManage.prePageId()
                const nextPageId = this.pageManage.nextPageId()
                const pageState= microApp.getGlobalData()?.pageState as any
                logger.log('发送同步数据', storeData.pageId)
                // 授课端找到前一页与后一页的state数据 并恢复给学生端
                if(pageState) {
                    const preloadPageState = {
                        [prePageId]: pageState[prePageId],
                        [nextPageId]: pageState[nextPageId]
                    }
                    this.nativeBridge.sendCwState({...storeData, pageState: cleanObject(preloadPageState)})
                } else {
                    this.nativeBridge.sendCwState(storeData)
                }
            }
            
        }
    }


    /**
     * @description: 添加异常日志监控
     * @return {*}
     */
    private addErrorListener() {
        console.log('addErrorListeners');
        window.removeEventListener('error', this.errorHandler);
        window.removeEventListener('unhandledrejection', this.rejectionHandler);
        window.addEventListener('error', this.errorHandler);
        window.addEventListener('unhandledrejection', this.rejectionHandler);
    }


      /** handle global error */
    public errorHandler(e: ErrorEvent): void {
        const eventContent: ERR0R_CATCH_EVENT = {
            message: e.message + '',
            filename: e.filename + '',
            lineno: +e.lineno,
            colno: +e.colno,
        };
        if (e.error instanceof Error) {
            eventContent.stack = e.error?.stack + '';
        } else {
            eventContent.error = e.error + '';
        }

        logger.error('Error Catch', ...Object.values(eventContent));


        // e.preventDefault();
    }

    /** handle global unhandle promise rejection */
    public rejectionHandler(e: PromiseRejectionEvent): void {
        // 解析reason
        let reason: any = '';
        if (typeof e.reason === 'string') {
            reason = e.reason;
        } else if (e.reason instanceof ErrorEvent) {
            reason = {
                message: e.reason.message + '',
                filename: e.reason.filename + '',
                lineno: +e.reason.lineno,
                colno: +e.reason.colno,
                stack: e.reason.error?.stack + '',
            };
        } else if (e.reason instanceof Error) {
            reason = {
                message: e.reason.message + '',
                stack: e.reason?.stack + '',
            };
        } else {
            reason = JSON.stringify(e.reason);
        }

        // 打印reason
        logger.error('Error Catch (unhandledrejection)', reason);


        // 或许没用，这个操作将会使控制台中不会打印出原本默认打印的一条报错日志
        // e.preventDefault();
    }

    /**
     * @description: 初始话埋点信息
     * @return {*}
     */
    initLogger() {
        // 流程日志
        Logger.setRemoteLogInfo(this.params.liveId, this.params.userId);
        Logger.setBatchLogFrequencyLevel(BATCH_LOG_FREQUENCY_LEVEL.LOW);
        // 业务日志
        xesLogger.setRemoteLogInfo(this.params.liveId, this.params.userId);
        xesLogger.setBatchLogFrequencyLevel(BATCH_LOG_FREQUENCY_LEVEL.LOW);
    }


    /**
     * @description: 设置课件地址
     * @return {*}
     */
    async setSlideUrl() {
        const slideInfo = this.pageManage.slidePageInfo;
        const slideLocalUrl = `${slideInfo.localRootPath}${slideInfo.localPath}/index.html?player=mcc&mode=${this.isSender ? 'sender' : 'receiver'}`
        const isExist = await isRemoteResourceExist(slideLocalUrl);
        logger.log(isExist,'本地课件地址是否可用', slideLocalUrl, Date.now())
        if(isExist) {
            logger.log('本地课件地址为', slideLocalUrl)
            this.setCourseUrl(slideLocalUrl)
            this.pageManage.aliLogSend({
                name: 'load_start',
                type: 'local',
                option: {
                    url: slideLocalUrl
                }
            })
        } else {
            this.setRemoteSlideUrl(slideInfo.remotePath, slideInfo.cdnPathList)
            
        }
    }

    /**
     * @description: 设置远程地址
     * @param {string} remotePath 远程path
     * @param {string} cdnPathList cdn域名list
     * @param {number} count 请求次数 为了选择cdnList中的第几个
     * @return {*}
     */
    async setRemoteSlideUrl(remotePath: string, cdnPathList: string[], count: number = 0) {
        if(count === cdnPathList.length) {
            logger.log('课件远程所有地址均加载失败')
            return
        }
        const remoteUrl = `${cdnPathList[count]}${remotePath}/index.html?player=mcc&mode=${this.isSender ? 'sender' : 'receiver'}`
        const isExist = await isRemoteResourceExist(remoteUrl);
        logger.log('课件远程地址为',remoteUrl, '是否可用', isExist)
        if(isExist) {
            logger.log('设置课件url为', remoteUrl)
            this.setCourseUrl(remoteUrl)
            this.pageManage.aliLogSend({
                name: 'load_start',
                type: 'remote',
                option: {
                    url: remoteUrl
                }
            })
        } else {
            this.setRemoteSlideUrl(remotePath, cdnPathList, count + 1)
        }
    }
    
    // 向服务端获取最新实时数据
    receiveStoreData() {
        this.nativeBridge.getStoredData()
    }
}