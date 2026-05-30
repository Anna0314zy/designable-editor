import { useRef } from 'react'
import PageThumbnail from '../../../../components/pagePreview'
import { Page } from '@/store/models/page'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import useCanvasRect from '../hooks/useCanvasRect'
import PreviewUi from './PreviewUi'
function Preview({ data, globalProps }: { data: Page; globalProps: any }) {
  const previewRef =useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef =useRef<HTMLDivElement>(null);
  const { viewportRatio, viewportPercentage } = useSelector((state: RootState) => state.global)
  useCanvasRect({previewRef,wrapperRef,contentRef,viewportRatio,viewportPercentage})
  return (
    <PreviewUi data={data} globalProps={globalProps} {...{previewRef,wrapperRef,contentRef}}>
      <PageThumbnail data={data} globalProps={globalProps} />
      </PreviewUi>
  )
}

export default Preview
