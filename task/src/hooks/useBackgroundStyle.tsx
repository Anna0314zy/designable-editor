import { nodeSchemaToSchema } from '@play/render'
import { useEffect, useState } from 'react'
import { Page } from '@/store/models/page'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
const useBackgroundStyle = ({ data, fileList }: { data: Page; fileList: { [key: string]: any }[] }) => {
  const { globalConfig } = useSelector((state: RootState) => state.page)
  const cdnPath = globalConfig?.resourceData?.remote?.cdnPathList?.[0] || ''
  const [backgroundObj, setBackgroundObj] = useState<{
    backgroundSize?: string
    backgroundRepeat?: string
    backgroundPosition?: string
    backgroundImage?: string
    backgroundColor?: string
  }>({
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  })
  useEffect(() => {
    
    if (Object.keys(data).length > 0) {
      const schema = nodeSchemaToSchema(data)
      const backgroundColor = schema.props.style?.backgroundColor
      if (backgroundColor && !schema.props.style?.backgroundImage) {
        setBackgroundObj(prev => ({ ...prev, backgroundColor,backgroundImage:''}))
      }else if(!backgroundColor && schema.props.style?.backgroundImage) {
        const url = fileList.find(item => item.fileMd5 === schema.props.style.backgroundImage)?.cosFullPath
        if (url) {
          setBackgroundObj(prev => ({
            ...prev,
            backgroundSize: schema.props.style.backgroundSize || 'cover',
            backgroundImage: `url(${cdnPath}${url})`,
            backgroundColor:''
          }))
        }else {
          setBackgroundObj(prev => ({ ...prev, backgroundColor:'#fff',backgroundImage:''}))
        }
      }else if(!backgroundColor && !schema.props.style?.backgroundImage) {
        setBackgroundObj(prev => ({ ...prev, backgroundColor:'#fff',backgroundImage:''}))
      }
    }
  }, [cdnPath, data, fileList])
  return [backgroundObj]
}
export default useBackgroundStyle
