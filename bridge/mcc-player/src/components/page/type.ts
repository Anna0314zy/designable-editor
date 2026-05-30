export interface pageList {
    id: string,
    pageId: string,
    pageType: number,
    sortIndex: number,
    hosts: string[], 
    path: string,
    baseDir: string,
    remotePath: string
}
export interface PageMain {
    width: string | number,
    height: string | number
}

export interface PathConfig {
    type: string,
    name: string,
    path: string
}

export interface StoreData {
    pageId: string,
    pageInfo: any,
    pageType: number
}


export enum PageType {
	NORMAL_PAGE = 1,
	GAME_PAGE = 2,
	VIDEO_PAGE = 3,
}

export interface PageInfo {
    id: string | number,
    pageId: string,
    slideId: string,
    pageType: number,
    gameId: string | number,
    gameTemplateId: string | number,
    fileResourceDtoList: any[],
    createTime: number,
    updateTime: number
}

export interface SlideInfo  {
    localPath: string, // 本地路径地址
    remotePath: string, // 远程路径地址
    cdnPathList: string[], // cdn域名列表
    localRootPath: string // 本地根目录
}