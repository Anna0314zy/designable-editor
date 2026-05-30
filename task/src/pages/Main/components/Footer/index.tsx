import { memo, useMemo } from 'react'
import { IconWidget } from '@editor/react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, Dispatch } from '@/store'
import { Space } from 'antd'
import CopyToClipboard from '../CopyToClipboard'
const FooterBar = () => {
  const { viewportPercentage } = useSelector((state: RootState) => state.global)
  const {
    currentPage,
    slides: { pageList },
  } = useSelector((state: RootState) => state.page)
  const dispatch = useDispatch<Dispatch>()
  const handleAdd = () => {
    dispatch.global.updateData({ viewportPercentage: viewportPercentage + 0.1 })
  }
  const handleMinus = () => {
    dispatch.global.updateData({ viewportPercentage: viewportPercentage - 0.1 > 0.3 ? viewportPercentage - 0.1 : 0.3 })
  }
  const currentIndex = useMemo(() => {
    return pageList.findIndex(item => item.id === currentPage.id)
  }, [currentPage, pageList])
  return (
    <div className='main-footer'>
      <div className='courseList' style={{ paddingLeft: '30px' }}>
        <Space>
          <CopyToClipboard text={currentPage.id}>
          <span> 课件页:</span>
          </CopyToClipboard>
          <span>
            {currentIndex + 1} / {pageList.length}
          </span>
        </Space>
      </div>
      <div className='right'>
        <IconWidget
          tooltip={{
            title: '缩小',
            placement: 'top',
          }}
          infer='Minus'
          className='icon'
          onClick={handleMinus}
        />
        <div className='text'>{Math.floor(viewportPercentage * 100) + '%'}</div>
        <IconWidget
          onClick={handleAdd}
          infer='Plus'
          tooltip={{
            title: '放大',
            placement: 'top',
          }}
          className='icon'
        />
      </div>
    </div>
  )
}
export default memo(FooterBar)
