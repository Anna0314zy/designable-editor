import { pageList, PageType, PathConfig, PageInfo, SlideInfo } from "./type";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { protocol, isRemoteResourceExist, transformData, replacePlaceholders } from "@/utils";
import { PATH_TYPE, SLIDE_NAME } from './const'
import microApp from "@ld/micro-app";
import { InitParam } from "@/interface";
import Logger from '@/libs/logger';
import XesLogger from '@/libs/xesLogger';
import { debug } from "console";
const logger = new Logger('[pageManager]');
const xesLogger = new XesLogger();
const JSON_STATUS = {
  Fulfilled: 'fulfilled', // 已完成
  PEDDING: 'pedding', // 进行中
}

export default class PageManage {
  public currentPageInfo: PageInfo | any = {
    id:'',
    pageId: '',
    slideId: '',
    pageType: 1,
    gameId: '',
    gameTemplateId: '',
    fileResourceDtoList: [],
    createTime: 0,
    updateTime: 0
  };

  // 埋点日志logid
  private logId = 0

  public catalogueData:any = {}
  // pageList
  public pageList: pageList[] = [];
  // 目录list
  public catalogueHosts: string[] = []
  public catalogueList: pageList[] = [];

  public pageType = PageType.NORMAL_PAGE;
  public Http!: AxiosInstance; // axios实例
  public urlPrefix = ''
  public COURSE_REQUEST_MAX_TIME = 10000; 

  public params!: InitParam;

  public getJsonStatus = JSON_STATUS.Fulfilled

  // json中本地远程数据
  public local:any = {}
  public remote: any
  public remoteCatalogue: any = []
  public localCatalogue: any = []


  // page页面目录
  public remotePagePath: string = ''
  public localPagePath: string = ''

  // 课件数据详情
  public slidePageInfo: SlideInfo = {
    localPath: '',
    remotePath: '',
    cdnPathList: [],
    localRootPath: ''
  }

  public cloudPage:any = {}

  // 是否为本地
  public isLocal: boolean = false

  public pageLoadSuccess:boolean = false
  // 切页是否完成  false 切页进行中  true 已切页完成
  public pageChangeComplete:boolean = false


  /**
   * @description: 当前页是否为游戏页
   * @return {*}
   */
  public isGame() {
    return this.pageType === PageType.GAME_PAGE;
  }

  /**
   * @description: 下一页id
   * @return {*}
   */
  public nextPageId = () => {
    const currentIndex = this.catalogueList.findIndex((page: any) => page.id === this.currentPageId())
    return this.catalogueList.find((_page: any, index:number) => index === currentIndex + 1)?.id || ''
  }

  /**
   * @description: 上一页id
   * @return {*}
   */
  public prePageId = () => {
    const currentIndex = this.catalogueList.findIndex((page: any) => page.id === this.currentPageId())
    return this.catalogueList.find((_page: any, index:number) => index === currentIndex - 1)?.id || ''
  }

  /**
   * @description: 当前页id
   * @return {*}
   */
  public currentPageId() {
    return this.currentPageInfo.id
  }

  public currentPageJson(): any {
    const globalData =  microApp.getGlobalData() || {}
    return globalData[this.currentPageId()]
  } 

  /**
   * 生成axios实例
   */
  public createHttp(): void {
    this.Http = axios.create({
      baseURL: this.urlPrefix,
      timeout: this.COURSE_REQUEST_MAX_TIME,
      validateStatus: (status) => {
        if (protocol.is.file(this.urlPrefix)) {
          return status === 0 || (status >= 200 && status < 300);
        } else {
          return status >= 200 && status < 300;
        }
      },
    });
    this.Http.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (err) => {
        console.log(err);
      }
    );

    this.Http.interceptors.response.use(
      (response: AxiosResponse) => {
        const { status } = response;
        if (status === 0 || (status >= 200 && status < 300)) {
          return Promise.resolve(response.data);
        } else {
          return Promise.reject(response.data);
        }
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  /**
   * @description: 获取课件 本地/远程路径
   * @param {any} configJson 所有的pageJson
   * @return {*}
   */
  private getCommonUrl(configJson: any) {
    const { commonResourceList, localResourcePathDefinition, remoteResourcePathDefinition } = configJson
    // 课件地址详细信息 版本号等信息
    const currentSlideInfo = commonResourceList.find((item: any) => item.customIdentityId === SLIDE_NAME)

    // 本地课件path
    const localSlidePath = replacePlaceholders(localResourcePathDefinition.commonPathDefinition.path, {
      customIdentityId: currentSlideInfo.customIdentityId,
      version: currentSlideInfo.version
    })
    
    // 远程课件path
    const remoteSlidePath = replacePlaceholders(remoteResourcePathDefinition.commonPathDefinition.path, {
      customIdentityId: currentSlideInfo.customIdentityId,
      version: currentSlideInfo.version
    })

    logger.log('preview version is', currentSlideInfo.version)


    // 课件地址组装
    this.slidePageInfo = {
      localPath: localSlidePath,
      remotePath: remoteSlidePath,
      cdnPathList: remoteResourcePathDefinition.commonPathDefinition.cdnPathList,
      localRootPath: this.params.localRootPath
    }
  }

  /**
   * @description: 获取目录 进行资源重组
   * @return {*}
   */
  public async setCatalogueData() {
    this.createHttp()
    const { mccPathDefinition } = this.cloudPage
    const configJson = {...this.catalogueData, ...mccPathDefinition}
    this.getCommonUrl(configJson)
    
    // 获取对应的config.json
    const remoteJson = configJson.remoteResourcePathDefinition
    // 获取远程目录地址
    const remoteBootstrap = remoteJson.staticPathDefinition.pathConfigList.find((config: PathConfig) => config.type === PATH_TYPE.SLIDE)
    // 获取目录资源
    const remoteBootstrapUrl = replacePlaceholders(remoteBootstrap.path, {
      slideId: configJson.slideId,
      slideVersion: configJson.slideVersion
    }) + '/bootstrap.json'
    

    // 获取对应page目录地址
    const remotePage = remoteJson.staticPathDefinition.pathConfigList.find((config: PathConfig) => config.type === PATH_TYPE.PAGE)
    this.remotePagePath =  replacePlaceholders(remotePage.path, {
      slideId: configJson.slideId,
      slideVersion: configJson.slideVersion
    })


    // 本地资源获取
    const localJson = configJson.localResourcePathDefinition
    const localBootstrap = localJson.staticPathDefinition.pathConfigList.find((config: PathConfig) => config.type === PATH_TYPE.SLIDE)
    const localBootstrapUrl = this.params.localRootPath + replacePlaceholders(localBootstrap.path, {
      slideId: configJson.slideId,
      slideVersion: configJson.slideVersion
    }) + '/bootstrap.json'

    // 获取对应page目录地址
    const localPage = localJson.staticPathDefinition.pathConfigList.find((config: PathConfig) => config.type === PATH_TYPE.PAGE)
    this.localPagePath =  replacePlaceholders(localPage.path, {
      slideId: configJson.slideId,
      slideVersion: configJson.slideVersion
    })
    // const localPageJson  = this.params.localRootPath + localJson + '/pages'
    
    // 如果当前链接为本地连接 再去拼接本地数据
    if(this.isLocalUrl(location.href)) {
        // 本地存储数据
      this.local = {
        staticPathDefinition:{
          pathConfigList : localJson.staticPathDefinition.pathConfigList.map((item:any) => {
            return {
              ...item,
              path: replacePlaceholders(item.path, {
                slideId: configJson.slideId,
                slideVersion: configJson.slideVersion
              })
            }
          }),
          localRootPath: this.params.localRootPath
        }
      } 

      this.isLocal = true
    }
    else {
      this.isLocal = false
    }
    
    // 远程存储数据
    this.remote = remoteJson


    // 设置全局数据给课件
    microApp.setGlobalData({
      resource: {
        remote: this.remote.staticPathDefinition,
        local: this.local.staticPathDefinition
      }
    })

    // 记录页资源的cdn域名
    this.catalogueHosts = this.remote.staticPathDefinition.cdnPathList
    // 当前是本地 且有根目录 才会去请求本地资源
    const isExist = this.isLocal && this.params.localRootPath &&  await isRemoteResourceExist(localBootstrapUrl);
    logger.log('本地目录是否可用', isExist, localBootstrapUrl)
    // 目录整体数据是否可用
    if(isExist) {
      try {
        // 请求本地目录数据
        const localCatalogue: any = await this.Http({
          method: 'get',
          url: localBootstrapUrl,
        })
        this.localCatalogue = localCatalogue.map((page: any) => {
          return {
            ...page,
            path: this.localPagePath + '/' + page.id + '.json',
            baseDir: this.params.localRootPath,
            remotePath: this.remotePagePath + '/' + page.id + '.json',
            hosts: this.catalogueHosts
          }
        })
        this.catalogueList = this.localCatalogue;
        // 根据本地目录id 拉取最新目录信息
        // this.catalogueList = await this.getLocalCatalogue(localCatalogue.pages, this.local.pages)
      } catch(e) {
        console.log('err', e)
        if(!this.remoteCatalogue.length) {
          this.remoteCatalogue = await this.getRemoteJson(remoteBootstrapUrl, this.catalogueHosts)
        }
        this.catalogueList = this.remoteCatalogue
      }
    } else { // 本地数据不可用 启用远程
      this.remoteCatalogue = await this.getRemoteJson(remoteBootstrapUrl, this.catalogueHosts)
      this.catalogueList = this.remoteCatalogue
    }
  }

  /**
   * @description: 获取本地资源目录
   * @param {*} catalogueList  本地资源目录idList
   * @param {*} pages 本地资源实际目录
   * @return {*}
   */
  async getLocalCatalogue(catalogueList: any[], pages: any[]) {
    const localCatalogue = catalogueList.map( async (catalogue) => {
      // 如果本地目录中 对应id资源存在
      if(pages.find(catalogue.id)) {
        return pages.find(catalogue.id)
      } else {
        if(!this.remoteCatalogue.length) {
          // 若找不到对应页面资源，或本地资源不可用时
          this.remoteCatalogue = await this.getRemoteJson(this.remote.bootstrap.path, this.remote.bootstrap.hosts)  
        }
        return this.remoteCatalogue.find(catalogue.id)
      
      }
    })
    return localCatalogue
  }

  /**
   * @description: 判断当前是否为远程或者本地
   * @param {string} url
   * @return {*}
   */
  private isLocalUrl(url: string): boolean {
    return (
      protocol.is.owcr(url) ||
      // protocol.is.localHost(url) ||
      protocol.is.file(url)
    );
  }

  /**
   * @description: 获取远程地址通用方法
   * @return {*}
   */
  async getRemoteJson(path: string, hosts: string[], count = 0): Promise<any> {
    if(count === hosts.length) {
      logger.log('请求远程地址失败')
      return
    }
    try {
      const remoteData: any = await this.Http({
        method: 'get',
        url: hosts[count] + path
      }) as unknown
      return remoteData.map((page: any) => {
       return {
        ...page,
        remotePath: this.remotePagePath + '/' + page.id + '.json',
        hosts: this.catalogueHosts
       }
      })
    } catch(err) {
      console.log('远程资源请求失败',hosts[count] + path, err)
      return await this.getRemoteJson(path, hosts, count + 1)
    }
   
  }

  /**
   * @description: 设置可见页面信息
   * @return {*}
   */
  async setCoursePageInfo() {
    
    // 如果资源列表正在发起请求中 不在进行请求
    if(this.getJsonStatus === JSON_STATUS.PEDDING) {
      return
    }
    const pageList: any = await this.getCourseJson(this.catalogueList);
    // 资源请求完成记录状态
    this.getJsonStatus = JSON_STATUS.Fulfilled
    this.pageList = pageList.filter((item: any) => item.pageId);
    // 设置全局数据
    await this.setGlobalData(pageList)
  }

  setGlobalData(pageList: any) {
    return new Promise(resolve => {
      microApp.forceSetGlobalData(transformData(pageList), resolve);  
    })
    
  }

  /**
   * @description: 请求课件内每页的json
   * @param {pageList} catalogueList
   * @return {*}
   */
  getCourseJson(catalogueList: pageList[]): Promise<unknown[]> {
    const allRequest = catalogueList.map((catalogue) => {
      return new Promise((resolve, reject) => {
        const globalData = microApp.getGlobalData() || {};
        if (globalData[catalogue.id]) {
          resolve(globalData[catalogue.id]);
        } else {
          this.requestJson(catalogue, resolve, reject)
        }
      });
    });
    return Promise.all(allRequest);
  }

  /**
   * @description: 请求json
   * @param {pageList} data
   * @param {object} resolve
   * @param {object} reject
   * @param {*} loadCount
   * @param {*} isRemote
   * @return {*}
   */
  async requestJson(data: pageList, resolve: { (value: unknown): void; (arg0: any): void; }, reject: { (reason?: any): void; (arg0: string): void; }, loadCount = 1) {
    const { hosts, path, baseDir, remotePath } = data
    // 先请求本地资源 未成功 且所有备用cdn地址加载全部失败时
    if(loadCount === this.catalogueHosts.length + 2 && baseDir) {
      logger.log('本地地址远程地址 全部加载失败')
      resolve({})
      return
    } else if(loadCount === this.catalogueHosts.length + 1 && !path) { 
      // 一进来就是远程时
      logger.log('远程地址备用地址全部加载失败')
      resolve({})
      return
    }
    let url
    if(baseDir) {
      url = loadCount > 1 ? this.catalogueHosts[loadCount - 2] + path : baseDir + path 
    } else {
      logger.log('请求远程资源', url)
      // 若存在path  就认为 先加载的本地 次数要加一 无path 认为一进去就加载远程 
      url = hosts[loadCount - (path ? 2 : 1)] + remotePath
    }
    const isExist = await isRemoteResourceExist(url);
    if(isExist) {
      this.Http({
        method: "get",
        url: url,
      })
        .then((res: any) => {
          resolve(res);
        })
        .catch(() => {
          // 这里请求失败时需要更换为切远程地址等操作
          this.requestJson({...data, baseDir: ''}, resolve, reject, loadCount + 1)
        });
    } else {
      logger.log('对应资源不可用', url)
      this.requestJson({...data, baseDir: ''}, resolve, reject, loadCount + 1)
    }
    
  }

  /**
   * @description: 公共数据埋点参数
   * @return {*}
   */
  getCommonLog() {
    this.logId++
    return {
      live_type: 'LE_SMALL_CLASS_MODE',
      source_type: this.params.client === 'tcp' ? 2 : 1,
      class_mode: this.params.class_mode,
      user_id: this.params.userId,
      live_id: this.params.liveId,
      guid: this.params.guid,
      log_id: this.logId,
      times_tamp: Date.now()
    }
  }

  /**
   * @description: 发送业务埋点
   * @param {any} param
   * @return {*}
   */
  aliLogSend(param: any) {
    const logParam = {
      ...this.getCommonLog(),
      ...param
    }
    xesLogger.log(JSON.stringify(logParam))
  }
}
