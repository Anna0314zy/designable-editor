import { createModel } from '@rematch/core'
import { RootModel } from '.'
import * as api from '@/api/models/page'
import { message } from 'antd'
export enum PageType {
  normalPage = 1,
  gamePage = 2,
  videoPage = 3,
}
//  interface Slide {
//   slideId: string;
//   slideName: string;
//   pageList: Page[];
// }

export interface Page {
  id: string
  pageType: number
  componentName: string
  sourceName: string
  props: Props
  hidden: boolean
  children: Child[]
}
interface fileItemIF {
	ossFileName?:string
	fileMd5:string
	resourceType:string
	cosFullPath: string
}
// interface PageInfo {
//   id: string;

// }
interface globalPropsIF {
  fileList?: Array<fileItemIF>
  initStyleProps?: Record<string, any>
  styleMapProps?: Record<string, any>
}
interface Props {
  style?: Style
  info?: {
    name?: string
  }
  title?: string
  'x-component'?: string
  'x-decorator'?: string
  shapeKey?: string
  src?: string
  gameUrl?: string
  picUrl?: string
  gameCoursewareId?: number
}

interface Style {
  backgroundColor?: string
  width?: string
  height?: string
  transform?: string
}

interface Child {
  id: string
  componentName: string
  sourceName: string
  props: Props
  hidden: boolean
  children: Child[]
}
interface PageState {
  slides: {
    slideId: string
    pageList: Page[]
  }
  currentPage: Page
  globalConfig:any,
  globalProps:globalPropsIF
}

export default createModel<RootModel>()({
  state: {
    slides: { slideId: '', pageList: [] },
    currentPage: {} as Page,
    globalConfig: {
      resourceData: {
        remote: {
          cdnPathList: [`${import.meta.env.VITE_CDN_SERVER}`],  
        }
      }
    },
    globalProps:{
      fileList:[],
      initStyleProps: { opacity: 0, visibility: 'hidden' },
      styleMapProps: {},
    }
  } as PageState,
  reducers: {
    updatePage(state, payload: Partial<PageState>) {
      return Object.assign(state, payload)
    },
    updateGlobalProps(state, payload: { [key: string]: any}) {
       state.globalProps = Object.assign(state.globalProps, payload)  
    },
  },
  effects: dispatch => ({
    async getCourseWareList(payload: { pages: Page[]; currentPage: Page }) {
      // console.log('getCourseWareList', payload)
      dispatch.page.updatePage(payload)
    },
    // 获取课件信息
    async getSlideList(payload: { slideId: string,pageId?:string }) {
      const res = await api.getSlideList({ slideId: payload.slideId })
      // res.slideStructure 是课件的顺序
      // res.pageContentDtoList 是课件的内容
      // cur.mainContentStructure
      try{
        const sort: { id: string }[] = JSON.parse(res.slideStructure)
        if (res?.pageContentDtoList?.length) {
          const sortIndex = sort.reduce((acc, item, index) => {
            acc[item.id as string] = index
            return acc
          }, {} as { [key: string]: number })
          let fileList:api.FileList[] = []
          const pages: Page[] = res.pageContentDtoList.reduce((pre, cur) => {
            const data = JSON.parse(cur.mainContentStructure || '{}')
            if(sortIndex[cur.pageId] !== undefined){
              fileList = fileList.concat(cur?.fileResourceDtoList || [])
              return pre.concat({ ...data.pageInfo, fileResourceDtoList: cur.fileResourceDtoList,pageType:cur.pageType })
            }
            return pre
          }, [])
          pages.sort((a, b) => sortIndex[a.id] - sortIndex[b.id])
          const currentPage = pages.find(item => item.id === payload.pageId) || pages[0]
          dispatch.page.updatePage({
            slides: {
              slideId: res.slideId,
              pageList: pages,
            },
            currentPage: currentPage,
            globalProps:{
              fileList
            }
          })
        }
      }catch(e:any){
        message.error(e?.message)
      }
      
    },
  }),
})
