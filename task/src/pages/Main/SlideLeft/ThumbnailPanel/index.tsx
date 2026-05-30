import useComputedSize from '../../../../hooks/useComputedSize'
import PageThumbnail from '../../../../components/pagePreview'
import { Page } from '@/store/models/page'
import { memo } from 'react'
import  useBackgroundStyle from '@/hooks/useBackgroundStyle'
export const DEFAULT_WIDTH = 153
export const DEFAULT_HEIGHT = 115
function ThumbnailPanel({ data, globalProps }: { data: Page; globalProps: any }) {
  const { size } = useComputedSize({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT })
  const [style] = useBackgroundStyle({ data, fileList: globalProps.fileList })
  return (
    <div className='preview-container' style={{ height: size.wrapperHeight, width: size.wrapperWidth,...style }}>
      <div
        className='preview-canvas'
        style={{ transform: `scale(${size.scale})`, transformOrigin: '0 0', height: '960px', width: '1280px' }}
      >
        <PageThumbnail data={data} globalProps={globalProps} mode="edit"/>
      </div>
    </div>
  )
}

export default memo(ThumbnailPanel)
