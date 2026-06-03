import { RenderRoot, nodeSchemaToSchema } from '@play/render'
import { Page } from '@/store/models/page'
import GamePreview from '@/components/GamePreview'
import { useEffect, useState, memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import  {AnimationWidgetWithErrorBoundary}  from './Animation'
import { CameraComponent } from '@ld/slide-editor'
interface PageInfo {
  id: string
  props: {
    info?: Record<string, any>
    style: Record<string, any>
    animates: Record<string, any>[]
  }
}
function PageThumbnail({ data }: { data: Page }) {
  // 全局数据
  const { globalProps = {},currentPage, globalConfig } = useSelector((state: RootState) => state.page)
  const [pageInfo, setSchema] = useState<PageInfo>({ props: { style: {}, animates: [] }, id: '' })
  const [load,setLoad] = useState(false)
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const schema = nodeSchemaToSchema(data)
      setSchema(schema as any)
      setSchema(prev => {
        setLoad(true)
        return prev
      })
    }
  }, [data])
  if (!pageInfo.id) return null
  return (
    // <div className='preview-inner' style={{ width: '100%', height: '100%' }}>
      <RenderRoot
        schema={pageInfo}
        widgets={{
          Game: () => GamePreview(data),
          Camera: CameraComponent,
        }}
        methods={{}}
        globalProps={globalProps || {}}
        globalConfig={globalConfig}
      >
        {load && <AnimationWidgetWithErrorBoundary pageInfo={currentPage} />}
      </RenderRoot>
    // </div>
  )
}

export default memo(PageThumbnail)
