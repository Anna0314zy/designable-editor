import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CourseListResponse, CourseListItem } from '@/api/models/course'
import { useEffect, useState } from 'react'

interface IProps {
  data: CourseListResponse
  onTableChange: (params: { pageNo: number; pageSize: number }) => void
  handleDetail: (data:CourseListItem) => void
  loading?:boolean
}

const TableList: React.FC<IProps> = ({ data, onTableChange, handleDetail,loading=false }) => {
  const [tableTop,setTableTop] = useState(0)
  const columns: ColumnsType<CourseListItem> = [
    {
      title: 'Action',
      key: 'action',
      render: (_,data) => <a onClick={() =>handleDetail(data)}>进入</a>,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '分校',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '学季',
      dataIndex: 'seasonName',
      key: 'seasonName',
    },
    {
      title: '年级',
      dataIndex: 'gradeName',
      key: 'gradeName',
    },
    {
      title: '学科',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: '版本',
      dataIndex: 'bookVersionName',
      key: 'bookVersionName',
    },
  ]
  useEffect(() => {
   setTimeout(() => {
    const tableHead = document.querySelector('#home-courseList-table .ant-table-thead')?.getBoundingClientRect();
    setTableTop((tableHead?.top  || 0 )+ (tableHead?.height || 0))
   },0)
  },[])
  return (
    <Table
     id="home-courseList-table"
     loading={loading}
      rowKey='id'
      columns={columns}
      dataSource={data.records}
      // scroll={{y:500}}
      scroll={{ y: `calc(100vh - ${tableTop + 64}px)` }}
      pagination={{
        total: data.total,
        current: data.current,
        pageSize: data.size,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: total => `共${total} 条`,
        onChange: (page, pageSize) => {

          onTableChange({
            pageNo: page,
            pageSize,
          })
        },
      }}
    />
  )
}

export default TableList
