import { Drawer, Spin, Row } from 'antd'
import React, { useState, useImperativeHandle, forwardRef, useEffect, useCallback, useRef } from 'react'
import * as api from '@/api/models/course'
import RenderItem from './RenderItem'
import { useInterval } from 'ahooks';
// interface IDataList {
//   no:number;
//   name:string;
// }
export interface Slide {
  mainId?: string //产品id
  slideId?: string
  serialNumber?: string
  name?: string
  lessonInformation?: string
  no?: number | string;
  title?:string,
  slideContentDto?: any
}

const Detail = ({ data }: { data?: api.CourseListItem }, ref: any) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const projectList = useRef<Slide[]>([])
  const [slideList, setSlideList] = useState<Slide[]>([])
  const onClose = () => {
    setOpen(false)
  }
  const onOpen = () => {
    setOpen(true)
  }
  // 绑定ref对外引用
  useImperativeHandle(ref, () => ({
    onClose,
    onOpen,
  }))
  const updataListStatus = (id: string, status: string) => {
    const list = slideList.map(item => {
      // const slides = slideListData.find(slide => String(slide.serialNumber) === String(item.no))
      if (item.slideId === id) return {
        ...item,
        slideContentDto: {...item.slideContentDto, slideStatus: status}
      }
      return {
        ...item
      }
    })
    setSlideList(list)
  }
  const getSlideData = useCallback(async () => {
    //请求课件信息
    if (!data?.id) return
    setLoading(true)
    try {
      const slideRes = await api.getSlideDetail({ productId: data?.id })
      const slideListData = slideRes?.bindSlideDtoList || []
      //
      const slideData = projectList.current?.map((item, index) => {
        const slides = slideListData.find(slide => String(slide.serialNumber).toLowerCase() === String(item.no).toLowerCase())
        if (slides) {
          return {
            ...item,
            ...slides,
            title: data?.name + '-' + (item.name || index)
          }
        }
        return {
          ...item,
          serialNumber: String(item.no),
          mainId: data?.id,
          title: data?.name + '-' + (item.name || index)
        }
      })
      setSlideList(slideData)
    } finally {
      setLoading(false)
    }
  }, [data?.id, data?.name])
  const getList = useCallback(async () => {
    if (data?.id) {
      setLoading(true)
      try {
        const res = await api.getProductOutline({ productId: data?.id })
        const list = res?.noNameBeanList || []
        list.unshift({ name:'先导课',no:'IntroductoryLesson'})
        projectList.current = list
        getSlideData()
      } finally {
        setLoading(false)
      }
    }
  }, [data, getSlideData])
  useInterval(() => {
    if(open) getList()
  }, 5000);
  useEffect(() => {
    if(open) getList()
  }, [getList,open])
  const visibilitychange = useCallback(() => {
    if (document.hidden) {
      console.log('Tab is now hidden');
      // 在这里执行你的代码
    } else {
      getList()
      console.log('Tab is now visible');
      // 在这里执行你的代码
    }
  },[getList])
  useEffect(() => {
    document.addEventListener('visibilitychange',visibilitychange);
    return () => {
      document.removeEventListener('visibilitychange',visibilitychange)
  }
  }, [visibilitychange])
  return (
    <Drawer
      size='large'
      title='产品详情'
      placement={'right'}
      closable={false}
      onClose={onClose}
      open={open}
      rootClassName='course-detail-draw'
    >
      {/* 产品详情 */}
      <div className='ld-course-detail'>
        <Row>
          <span className='label'>产品id：</span>
          <span className='value'>{data?.id}</span>
        </Row>
        <Row>
          <span className='label'>产品名称：</span>
          <span className='value'>{data?.name}</span>
        </Row>
        <Row>
          <span className='label'>分校：</span>
          <span className='value'>{data?.cityName}</span>
        </Row>
        <Row>
          <span className='label'>年份：</span>
          <span className='value'>{data?.year}</span>
        </Row>
        <Row>
          <span className='label'>学季：</span>
          <span className='value'>{data?.seasonName}</span>
        </Row>
        <Row>
          <span className='label'>年级：</span>
          <span className='value'>{data?.gradeName}</span>
        </Row>
        <Row>
          <span className='label'>学科：</span>
          <span className='value'>{data?.subjectName}</span>
        </Row>
        <Row>
          <span className='label'>版本：</span>
          <span className='value'>{data?.bookVersionName}</span>
        </Row>
      </div>

      <Spin spinning={loading}>
        <RenderItem data={slideList} getSlideData={getSlideData} updataListStatus={updataListStatus} />
      </Spin>
    </Drawer>
  )
}
export default forwardRef(Detail)
