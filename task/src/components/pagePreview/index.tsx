import { RenderRoot, nodeSchemaToSchema } from '@play/render'
import { useEffect, useState, memo } from 'react'
import { Page } from '@/store/models/page'
import GamePreview from '../GamePreview'
import { CameraComponent } from '@ld/slide-editor'
// import {VideoPreview}  from "@slide/render-components";
import { VideoComponent } from '@slide/render-components'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
function PageThumbnail({ data, globalProps,mode }: { data: Page; globalProps: any,mode?:'edit' }) {
  const { globalConfig } = useSelector((state: RootState) => state.page)
  const [pageInfo, setSchema] = useState({ props: { style: {} } })
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const schema = nodeSchemaToSchema(data)
      setSchema(schema as any)
    }
  }, [data])
  return (
    Object.keys(pageInfo).length > 0 && (
      <div className='preview-inner' style={{ width: '100%', height: '100%' }}>
        <RenderRoot
          schema={pageInfo}
          widgets={{
            Game: () =><GamePreview props={data.children?.[0]?.props}/>,
            Camera: CameraComponent,
            Video: (props:any) => <VideoComponent mode={mode} {...props}></VideoComponent>
          }}
          methods={{}}
          globalProps={globalProps}
          globalConfig={globalConfig}
        ></RenderRoot>
      </div>
    )
  )
}

export default memo(PageThumbnail)
