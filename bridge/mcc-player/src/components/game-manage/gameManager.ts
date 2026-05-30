/**
 * @description: 游戏管理器
 * @return {*}
 */

import GameBridge from './gameBridge'
import microApp from '@ld/micro-app'
import { PageType } from '../page/type';
import { GAME_FRAME_NAME, HIDE_GAME } from '../page/const';
import { replacePlaceholders } from '@/utils';
import { GameNotifyMessage, INIT_STEP } from '@/interface';
import { GameNotifyType } from '../native-bridge/bridge-type';
import Logger from '@/libs/logger';

interface IGamePageData {
  /**下一页gamePageId */
  nextGamePageId: string,
  /**上一页gamePageId */
  lastGamePageID: string,
  /** */
  pageId?: string,
  gameData?: IGameData,
  pageType: PageType,
  gameName: string,
}
interface IBundleInfo {
  bundleName: string,
  bundleUrl: string,
  bundleType: EBundleType
}

enum EBundleType {
  MAIN_BUNDLE,  // 主包
  FRAME_BUNDLE,  // 框架
  PUBLIC_BUNDLE,  // 公共模块
  GAME_BUNDLE  // 游戏子包
}

enum EGameCreateType {
  OPEN,
  PRELOAD
}

interface IGameData {
  templateId: string,
  gameId: string,
  publicBundleInfo: IBundleInfo,
  gameBundleList: IBundleInfo[],
  createType: EGameCreateType,
  isSync: boolean,
  isSupportKeepPlay: boolean,
  pageId: string
}

export interface IUrlParams {
  frameUrl: string;
  isLoadFromLocal: boolean;
  localRootPath: string;
  cdnRootPathList: string[];
  initParams: any;
}

const logger = new Logger("[GameManager]");

class GameManager extends GameBridge {
  /**
   * @description: 重启游戏
   * @return {*}
   */
  constructor() {
    super()
  }
 
  private isLoadFromLocal: boolean = true; // 是否从本地加载
  private localRootPath: string = ''; // 本地资源根目录
  private cdnRootPathList: string[] = []; // cdn资源根目录列表

  /** 
   * 游戏详情
  */
  private gameDetails: Map<string, IGamePageData> = new Map();
  private currentPageId: string = '';

  public isAuthorization: boolean = false; // 是否被授权(授课端或者学生发起了接着玩、重新玩)

  public reloadGame() {
    microApp.reload('cocos').then(result => {
      if (result) {
        console.log('gameLog-重新渲染成功')
      } else {
        console.log('gameLog-重新渲染失败')
      }
    })
  }

  /**
   * 根据课件目录初始化游戏数据，此时并没有具体的游戏数据(templateId, gameId, bundle等)
   */
  public initData() {

    // 设置游戏资源路径
    this.isLoadFromLocal = this.pageManager.isLocal;
    this.setGameUrlParams();
    
    const globalData = microApp.getGlobalData() || {};
    // console.log('gameLog-globalData', globalData);
    // console.log('======= page.catalogueList:', this.pageManager.catalogueList);
    let lastGamePageId = '';
    for (let i = 0; i < this.pageManager.catalogueList.length; i++) {
      const pageData = this.pageManager.catalogueList[i];
      const isGamePage = pageData.pageType == PageType.GAME_PAGE;
      /**当前是游戏 之前的数据下一个游戏指向当前游戏*/
      if (isGamePage) {
        this.setGameNextPageId(pageData.id);
      }
      this.gameDetails.set(pageData.id, this.getBaseGameData(pageData, lastGamePageId));
      /**当前是游戏，记录下来，下一页的上一个游戏指向当前游戏 */
      if (isGamePage) {
        lastGamePageId = pageData.id;
      }
    }

    logger.log('initData', `this.gameDetails: ${JSON.stringify(this.gameDetails)}`);
  }

  /**
   * 设置游戏数据
   * @param pageDataList 
   */
  public setGameDataByPageJson(pageDataList: any[]) {
    pageDataList.forEach(pageData => {
      const gameDetail = this.gameDetails.get(pageData.pageId);
      if (!gameDetail) {
        return;
      }

      if (pageData.pageType == PageType.GAME_PAGE) {
        try {
          const content = JSON.parse(pageData.mainContentStructure);
          const gameInfo = content?.pageInfo?.children[0]?.props;
          if (!gameInfo) {
            console.log('缺少游戏数据, mainContentStructure: ', pageData.mainContentStructure);
            return;
          }

          gameDetail.gameName = gameInfo.gameName;
          const gameData = {
            templateId: gameInfo.gameTemplateId,
            gameId: gameInfo.gameId,
            publicBundleInfo: {
              bundleName: gameInfo.publicModel,
              bundleUrl: this.getPublicBundleUrl(gameInfo.publicModel),
              bundleType: EBundleType.PUBLIC_BUNDLE
            },
            gameBundleList: [
              {
                bundleName: gameInfo.gameTemplateName,
                bundleUrl: this.getSubGameBundleUrl(gameInfo.gameTemplateId, gameInfo.gameTemplateName),
                bundleType: EBundleType.GAME_BUNDLE
              }
            ],
            createType: EGameCreateType.OPEN,
            isSync: gameInfo.isSync,
            isSupportKeepPlay: gameInfo.isPlay,
            pageId: pageData.pageId
          }

          gameDetail.gameData = gameData;
        } catch (e) {
          console.log(e)
        }
      }
    });

    logger.log('setGameDataByPageJson');
  }

  public setGameNextPageId(nextGamePageId: string) {
    this.gameDetails.forEach(value => {
      if (value.nextGamePageId === '') {
        value.nextGamePageId = nextGamePageId;
      }
    });
  }


  public getBaseGameData(pageData: any, lastGamePageId: string): IGamePageData {
    const data: IGamePageData = {
      nextGamePageId: '',
      lastGamePageID: lastGamePageId,
      pageType: pageData.pageType,
      gameName: '',
    }
    return data
  }

  /**
   * 游戏切页
   */
  public changeGamePage() {
    const currentPageId = this.pageManager.currentPageInfo.id as string;
    // console.log('gameLog-获取当前页id', this.currentPageId, '课件页数据列表', this.pageManager.pageList);
    const curData = this.gameDetails.get(currentPageId);
    const nextData = curData?.nextGamePageId && this.gameDetails.get(curData.nextGamePageId);

    logger.log('changeGamePage', `currentPageId: ${currentPageId}; curData: ${JSON.stringify(curData)}; nextData: ${JSON.stringify(nextData)}`);

    // 触发了切页，就把游戏同步数据清掉
    if (this.storeData && this.storeData.pageId !== currentPageId) {
      this.storeData = {};
    }

    this.sendMessageToGame({
      eventName: 'pageChanged',
      data: {
        curPage: curData && curData.gameData,
        nextPage: nextData && nextData.gameData
      }
    });

    if(curData?.pageType === PageType.GAME_PAGE && this.gameFrameDone && !this.pageManager.pageLoadSuccess) {
      // console.log('关闭loading')
      logger.log('changeGamePage', '关闭loading');
      this.nativeBridge.SDKInitProgress({
          progress: INIT_STEP.READY
      })
      this.pageManager.pageLoadSuccess = true;
    }

    // 非游戏页暂停引擎
    if (this.gameFrameDone) {
      const action = curData?.gameData ? 'resume' : 'pause';
      this.sendMessageToGame({
        eventName: GameNotifyType.PauseOrResumeGame,
        data: {
          action: action
        }
      });
    }

    // 如果当前是游戏页，但没有配置游戏，需要隐藏游戏展示课件
    if (curData?.pageType === PageType.GAME_PAGE && !curData.gameData) {
      logger.log('changeGamePage', '当前是游戏页，但没有配置游戏，隐藏游戏，展示课件');
      this.emit(GameNotifyMessage, HIDE_GAME);
    }

    // 游戏页上报埋点
    if (curData?.pageType === PageType.GAME_PAGE) {
      this.pageManager.aliLogSend({
        name: 'mcc_page_changed',
        act: 'page_changed',
        option: {
          page_id: currentPageId,
          game_id: curData.gameData?.gameId,
          template_id: curData.gameData?.templateId
        },
        desc: '切到游戏页'
      });
    }
  }

  /**
   * 游戏预加载
   */
  public preloadGame() {
    const currentPageId = this.pageManager.currentPageInfo.id as string;
    const curData = this.gameDetails.get(currentPageId);
    const nextData = curData?.nextGamePageId && this.gameDetails.get(curData.nextGamePageId);
    logger.log('preloadGame', `nextData: ${JSON.stringify(nextData)}`);
    microApp.setData('cocos', {
      eventName: 'pagePreload',
      data: {
        curPage: null,
        nextPage: nextData && nextData.gameData
      }
    });
  }

  private setGameUrlParams() {
    const { mccPathDefinition } = this.pageManager.cloudPage;
    const { remoteResourcePathDefinition } = mccPathDefinition;
    this.localRootPath = this.pageManager.params.localRootPath;
    this.cdnRootPathList = remoteResourcePathDefinition.gameCustomPathDefinition.cdnPathList;
  }

  /**
   * 获取框架和公共模块地址
   */
  public getPublicBundleUrl(publicModelName: string) {
    const { mccPathDefinition } = this.pageManager.cloudPage;
    const configJson = { ...this.pageManager.catalogueData, ...mccPathDefinition };
    const { commonResourceList, localResourcePathDefinition, remoteResourcePathDefinition } = configJson;

    const publicBundleInfo = commonResourceList.find((item: any) => item.customIdentityId === publicModelName);
    if (!publicBundleInfo) {
      console.log('gameLog-未能获取到公共模块地址。commonResourceList: ', commonResourceList);
      return '';
    }

    const commonPathDefinition = this.isLoadFromLocal ? localResourcePathDefinition.commonPathDefinition : remoteResourcePathDefinition.commonPathDefinition;

    const publicBundlePath = replacePlaceholders(commonPathDefinition.path, {
      customIdentityId: publicBundleInfo.customIdentityId,
      version: publicBundleInfo.version
    });
    
    return publicBundlePath + '/' + publicModelName;
  }

  /**
   * 获取子游戏包地址
   */
  public getSubGameBundleUrl(templateId: string, templateName: string) {
    const { mccPathDefinition } = this.pageManager.cloudPage;
    const configJson = { ...this.pageManager.catalogueData, ...mccPathDefinition };
    const { gameTemplateResourceList, localResourcePathDefinition, remoteResourcePathDefinition } = configJson;

    const gameTemplateInfo = gameTemplateResourceList?.find((item: any) => item.gameTemplateId === templateId);
    if (!gameTemplateInfo) {
      console.log('gameLog-未能获取到子游戏包地址。gameTemplateResourceList: ', gameTemplateResourceList);
      return '';
    }

    const commonPathDefinition = this.isLoadFromLocal ? localResourcePathDefinition.gameTemplatePathDefinition : remoteResourcePathDefinition.gameTemplatePathDefinition;

    const gameTemplatePath = replacePlaceholders(commonPathDefinition.path, {
      gameTemplateId: gameTemplateInfo.gameTemplateId,
      version: gameTemplateInfo.version
    });
    
    return gameTemplatePath + '/' + templateName;
  }

  /**
   * 获取游戏地址
   */
  public getGameUrlParams() {
    const params: IUrlParams = {
      frameUrl: this.getPublicBundleUrl(GAME_FRAME_NAME),
      isLoadFromLocal: this.isLoadFromLocal,
      localRootPath: this.localRootPath,
      cdnRootPathList: this.cdnRootPathList,
      initParams: this.getInitParam()
    };

    return params;
  }

  public getWatchScreenData() {
    const gameParams = this.getGameUrlParams();
    gameParams.initParams = null;

    const currentPageId = this.pageManager.currentPageInfo.id as string;
    const curData = this.gameDetails.get(currentPageId);
    const syncData = (this.storeData && this.storeData.pageId === currentPageId) ? this.storeData.pageInfo?.gameSyncData : null;

    const data = {
      gameUrl: this.gameUrl,
      ...gameParams,
      pageData: curData?.gameData,
      syncData: syncData
    };

    return data;
  }
}

export default GameManager