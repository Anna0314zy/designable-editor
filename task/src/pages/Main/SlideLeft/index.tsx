import { List,Tooltip } from 'antd'
import { memo, useCallback,useContext } from 'react'
// import ThumbnailPanel from './ThumbnailPanel'
import { Page, PageType } from '@/store/models/page'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import cls from 'classnames'
import Item from './Item'
import Style from './styles.module.less'
import { useSaveTask } from '@/hooks/useSaveTask'
import { GlobalContext } from '../GlobalContext'
import { PageTypeLabelWidget } from '@editor/react'
interface SlideLeftProps {
  data: Page[]
  handleClick: (item: Page) => void
  mode?:'preview'
}
// 如果是视频则可以用截图
const SlideLeft = ({ data, handleClick,mode }: SlideLeftProps) => {
  const { form } = useContext(GlobalContext);
  const { handleSubmit } = useSaveTask(form)
  const { currentPage, globalProps,slides:{pageList} } = useSelector((state: RootState) => state.page)
  const { tasks } = useSelector((state: RootState) => state.task)
  const handlePageClick = useCallback(
    async(e: any, item: Page) => {
      // 如果任务没保存 保存任务\
      try {
        await handleSubmit(currentPage.id, true)
        handleClick(item)
      }catch(e){
        console.log(e)
      }
      
    },
    [currentPage.id, handleClick, handleSubmit],
  )
  const showError = (data:Page) => {
    if(mode === 'preview') return ;
    const currentPage = pageList.find((item) => item.id === data.id);
    if(currentPage?.pageType !== PageType.gamePage) return ;
    if(!currentPage?.children?.length) return ;
    const currentTask = tasks.filter((item) => item.pageId === data.id && item.elementId);
    if (data.pageType === PageType.gamePage && currentTask.length === 0) return 'Error'
  }
  return (
    <List
      className={cls(Style['course-list'], 'course-preview-list')}
      itemLayout='horizontal'
      dataSource={data}
      rowKey='id'
      renderItem={(item, index) => (
        <List.Item>
          <div className={Style['list-item']} onClick={e => handlePageClick(e, item)}>
            <div
              className={cls('left-text', {
                active: item.id === currentPage.id,
              })}
            >
              {index + 1}
            </div>
            <div className={Style['right']}>
              <div className={Style['title']}>{item?.props?.info?.name}</div>
              <div className={cls('thumbnail', { active: item.id === currentPage.id })}>
                <PageTypeLabelWidget rootProps={item.props} />
                <Tooltip title='缺少游戏相关任务' color="#fff" styles={{ body: { color: '#000' } }}>
                  <span style={{ position: 'relative', left: 0, top: 0, background: '#fff', color: 'red' }}>
                    {showError(item)}
                  </span>
                </Tooltip>

                <Item data={item} key={item.id} globalProps={globalProps} />
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  )
}

export default memo(SlideLeft)
