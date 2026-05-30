import styles from './index.module.less'
import cls from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, Dispatch } from '@/store'
import { useMemo, useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import SlideLeft from '@/pages/Main/SlideLeft'
import { useCallback } from 'react'
import { Page } from '@/store/models/page'
const Operations = () => {
  const dispatch = useDispatch<Dispatch>()
  const {
    currentPage,
    slides: { pageList },
  } = useSelector((state: RootState) => state.page)
  const currentIndex = useMemo(() => {
    return pageList.findIndex(item => item.id === currentPage.id)
  }, [currentPage.id, pageList])
  const handleChangePage = (val: 'l' | 'r') => {
    if (val === 'l') {
      if (currentIndex === 0) return
      dispatch.page.updatePage({
        currentPage: pageList[currentIndex - 1],
      })
    } else {
      if (currentIndex === pageList.length - 1) return
      dispatch.page.updatePage({
        currentPage: pageList[currentIndex + 1],
      })
    }
  }
  const handleClick = useCallback(
    (item: Page) => {
      dispatch.page.updatePage({ currentPage: item })
      setHovered(false)
    },
    [dispatch.page],
  )
  const [hovered, setHovered] = useState(false)
  const handleHoverChange = (open: boolean) => {
    setHovered(open)
  }
  return (
    <div className={styles['preview-operations']}>
      <div
        className={cls(styles.btn, styles.left, {
          [styles.disabled]: currentIndex === 0,
        })}
        onClick={() => handleChangePage('l')}
      >
        <LeftOutlined />
      </div>
      <Popover
        placement='top'
        overlayInnerStyle={{maxHeight:'calc(100vh - 150px)',overflowY:'auto',backgroundColor:'#eee'}}
        title={''}
        open={hovered}
        onOpenChange={handleHoverChange}
        content={
          <SlideLeft data={pageList} handleClick={handleClick} mode="preview"/>
        }
      >
        <div className={styles.page}>
          {currentIndex + 1} / {pageList.length}
        </div>
      </Popover>

      <div
        className={cls(styles.btn, styles.right, {
          [styles.disabled]: currentIndex === pageList.length - 1,
        })}
        onClick={() => handleChangePage('r')}
      >
        <RightOutlined />
      </div>
    </div>
  )
}
export default Operations
