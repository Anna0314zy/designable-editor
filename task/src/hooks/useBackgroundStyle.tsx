import { nodeSchemaToSchema } from '@play/render'
import { useEffect, useState } from 'react'
import { Page } from '@/store/models/page'
import { CDN } from '../components/pagePreview'
const useBackgroundStyle = ({ data, fileList }: { data: Page; fileList: { [key: string]: any }[] }) => {
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
            backgroundImage: `url(${CDN}${url})`,
            backgroundColor:''
          }))
        }else {
          setBackgroundObj(prev => ({ ...prev, backgroundColor:'#fff',backgroundImage:''}))
        }
      }else if(!backgroundColor && !schema.props.style?.backgroundImage) {
        setBackgroundObj(prev => ({ ...prev, backgroundColor:'#fff',backgroundImage:''}))
      }
    }
  }, [data, fileList])
  return [backgroundObj]
}
export default useBackgroundStyle
