import { useCallback, useRef, useState } from 'react'
import Filter from './components/Filter'
import List from './components/List'
import * as api from '@/api/models/course'
import './index.less'
import Detail from './components/Detail'
const Course = () => {
  const detailRef = useRef<any>()
  const [current, setCurrent] = useState<api.CourseListItem>()
  const searchParams = useRef<api.CourseListParams>({
    pageNo: 1,
    pageSize: 10,
  })
  const [data, setData] = useState<api.CourseListResponse>({
    records: [],
    total: 0,
    size: 0,
    current: 0,
  })
  const [loading,setLoading] = useState(false)
  const onSearch = async (values: api.CourseListParams) => {
    searchParams.current = values
    // 存储
    // sessionStorage.setItem('courseListParams', JSON.stringify(values))
    setLoading(true)
    try{
      const res = await api.getClassList({
        ...values,
        name: (values.name || '').replace(/\\t/g, ""),
        pageNo: 1,
        pageSize: 10,
      })
      setData(res)
    }finally{
      setLoading(false)
    }
  }
  const onTableChange = async ({ pageNo, pageSize }: { pageNo: number; pageSize: number }) => {
    searchParams.current = {
      ...searchParams.current,
      pageNo,
      pageSize,
    }
    const res = await api.getClassList(searchParams.current)
    setData(res)
  }
  const handleDetail = useCallback((data: api.CourseListItem) => {
    detailRef.current?.onOpen()
    setCurrent(data)
  }, [])
  return (
    <div className='ld-course-list'>
      <Filter onSearch={onSearch}/>
      <div className='content'>
        <List data={data} onTableChange={onTableChange} handleDetail={handleDetail} loading={loading}/>
        <Detail data={current} ref={detailRef} /> 
      </div>
    </div>
  )
}
export default Course
