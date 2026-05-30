/*
 * @Date: 2024-01-05 20:27:50
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-15 12:14:12
 * @FilePath: /slides-engine/task/src/pages/Course/components/Detail/RenderItem.tsx
 */
import { Button, Space, message } from 'antd'
import { useState } from 'react'
import { useRef } from 'react'
import { Slide } from './index'
import Style from './styles.module.less'
import { useCallback } from 'react'
import * as api from '@/api/models/page'
import moment from 'moment'

import AddModal from './AddModal'

interface RenderItemProps {
  data: Slide[]
  getSlideData: () => void
  updataListStatus: (id: string, status: string) => void
}

enum SlideStatus {
	editing = '待发布',
	published = '发布中',
	packed = '已发布',
}

const RenderItem = ({ data, getSlideData, updataListStatus }: RenderItemProps) => {
  const regex = /(\d+\.\d+\.\d+)/;
  const TaskVersion = localStorage.getItem('TaskVersion')
  const EditorVersion = localStorage.getItem('EditorVersion')
  const EditUrl = import.meta.env.MODE == 'dev' ? import.meta.env.VITE_PLAY_SERVER : import.meta.env.VITE_PLAY_SERVER.replace(regex, EditorVersion || '1.0.0')
  const HomeUrl = import.meta.env.MODE == 'dev' ? import.meta.env.VITE_HOME_SERVER : import.meta.env.VITE_HOME_SERVER.replace(regex, TaskVersion || '1.0.0')
  const modalRef = useRef<any>()
  const [current, setCurrent] = useState<Slide>({})
  const handleCreate = async (item: Slide) => {
    // 创建课件
    const res = await api.createSlidesId()
    if(item.serialNumber) {
      await api.bindSlides({
        mainId: item.mainId,
        serialNumber: item.serialNumber,
        slideId: res.slideId,
        slideTitle: item.title
      })
    }
    window.open(
      `${EditUrl}?id=${res.slideId}&title=${item.title}&productId=${item.mainId}&mode=preview`,
      '_blank',
    )
  }
  const handleEdit = (item: Slide) => {
    window.open(`${EditUrl}?id=${item.slideId}&title=${item.title}&productId=${item.mainId}&mode=preview`, '_blank')
  }
  const handleEditTask = (item: Slide,path?:string) => {
    window.open(`${HomeUrl}?title=${item.title}&productId=${item.mainId}&mode=${path === 'preview' ? 'sender' :'preview'}#/${path || 'task'}/${item.slideId}`, '_blank')
  }
  const handleAddInfo = useCallback(async (item: Slide) => {
    setCurrent(item)
    modalRef.current.open()
    // await addLessonInformation({mainId:item.mainId,serialNumber:String(item.no)})
  }, [])
  const infoBtn = (data: Slide) => {
    return data.serialNumber === 'introductorylesson' ? null : (
      <Button onClick={() => handleAddInfo(data)}>{data.lessonInformation ? '修改' : '添加'}课程信息</Button>
    )
  }
  const publishBtn = (data: Slide) => {
    const status = data.slideContentDto?.slideStatus
    const createTime = data.slideContentDto?.lastSlidePublishRecordDto ? data.slideContentDto?.lastSlidePublishRecordDto.createTime : null
    let text = ''
    if (status === 'editing' && createTime) {
      text = '更新发布'
    } else if (status === 'editing') {
      text = '发布课件'
    } else if (status === 'published') {
      text = '取消发布'
    }
    return <Button onClick={() => handlePublish(data.slideId as string, data.slideContentDto?.slideStatus)}>{text}</Button>
  }
  const handlePublish = async (slideId: string, status: string) => {
    if (status === 'editing') {
      await api.publishSlides({slideId: slideId})
      message.success('发布成功！课件打包中...')
      updataListStatus(slideId, 'published')
    } else if (status === 'published') {
      await api.cancelPublishSlides({slideId: slideId})
      message.success('取消发布成功！')
      updataListStatus(slideId, 'editing')
    }
  }
  return (
    <div className={Style['render-item']}>
      {data.map(item => (
        <div className='render-item__item' key={item.serialNumber}>
          {/* <span className="render-item__label">课次{item.no}:</span> */}
          <div className='render-item__value'>{item.name ? item.name : `第${item.no}讲`}</div>
          {/* 先导课没有课程信息 */}
          {item.serialNumber === 'introductorylesson' ? null : (
            <div className='render-item__value'>
              课程信息：<span>{item.lessonInformation}</span>
            </div>
          )}
          <div className='render-item__value'>
            课件状态：<span>{item.slideContentDto?.slideStatus ? SlideStatus[item.slideContentDto?.slideStatus as keyof typeof SlideStatus] : '--'}</span>
          </div>
          <div className='render-item__value'>
            发布时间：<span>{item.slideContentDto?.lastSlidePublishRecordDto ? moment(item.slideContentDto?.lastSlidePublishRecordDto.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
          </div>
          <div className='render-item__value'>
            课件id：<span>{item.slideId}</span>
          </div>
          <div className='btns'>
            {item.slideId ? (
              <Space>
                {item.slideContentDto?.slideStatus !== 'published' &&  <Button onClick={() => handleEdit(item)}>编辑课件</Button>}
                {item.slideContentDto?.slideStatus !== 'published' &&  <Button onClick={() => handleEditTask(item)}>编辑任务</Button>}
                {infoBtn(item)}
                {item.slideContentDto?.slideStatus !== 'packed' && publishBtn(item)}
                {item.slideContentDto?.slideStatus !== 'published' && <Button onClick={() => handleEditTask(item,'preview')}>预览</Button>}
              </Space>
            ) : (
              <Space>
                <Button onClick={() => handleCreate(item)}>创建课件</Button>
                {infoBtn(item)}
              </Space>
            )}
          </div>
        </div>
      ))}
      <AddModal ref={modalRef} data={current} getSlideData={getSlideData} />
    </div>
  )
}

export default RenderItem
