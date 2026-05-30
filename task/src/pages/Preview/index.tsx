import { useSelector,  } from 'react-redux'
import { RootState } from '@/store'
import { useEffect, useRef } from 'react'
import useCanvasRect from '@/pages/Main/components/hooks/useCanvasRect'
import PreviewUi from '@/pages/Main/components/Preview/PreviewUi'
import PreviewInner from './components/PreviewInner'
import Operations from './components/Operations'
import { useGetSlideData } from '@/hooks/useGetSlideData'
import { ChildHandshake, WindowMessenger } from 'post-me';
import {  useDispatch } from 'react-redux'
import { Dispatch } from '@/store'
import { Page } from '@/store/models/page'
interface IData {
  slideId:string;
  pages:Page[];
  fileList:any[]
  pageId:string
}
const Preview = ({getList = true}) => {
  const {
    currentPage,
    globalProps,
  } = useSelector((state: RootState) => state.page)
  const dispatch = useDispatch<Dispatch>()
  const previewRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { viewportRatio, viewportPercentage } = useSelector((state: RootState) => state.global)
  useCanvasRect({ previewRef, wrapperRef, contentRef, viewportRatio, viewportPercentage })
  const style = {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  } as React.CSSProperties
  useGetSlideData(getList)
  useEffect(()=> {
    // For safety it is strongly adviced to pass the explicit child origin instead of '*'
let remoteOrigin = import.meta.env.VITE_PLAY_SERVER as string;
if(!import.meta.env.DEV) {
  const match = remoteOrigin.match(/^(https?:\/\/)?([^\/]+)/i)!
  remoteOrigin = match[0];
}
const messenger = new WindowMessenger({
  localWindow: window,
  remoteWindow: window.parent,
  remoteOrigin: remoteOrigin
});
const methods = {
  getSlideData: (data:string) => {
    const dataObj = JSON.parse(data) as IData
    const currentPage = dataObj.pages.find((page:Page) => page.id === dataObj.pageId)
    dispatch.page.updatePage({
      slides: {
        slideId: dataObj.slideId,
        pageList: dataObj.pages,
      },
      currentPage,
      globalProps:{
        fileList:dataObj.fileList
      }
    })
}
}
ChildHandshake(messenger,methods).then((connection) => {
  connection.localHandle();
});
  },[dispatch.page])
  return (
      <div style={style}>
        {/* <TopHeader/> */}
        <PreviewUi data={currentPage} globalProps={globalProps} {...{ previewRef, wrapperRef, contentRef }}>
          <PreviewInner data={currentPage} />
        </PreviewUi>
        <Operations/>
      </div>
  )
}
export default Preview
