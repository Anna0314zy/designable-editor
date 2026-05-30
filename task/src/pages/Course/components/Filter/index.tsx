import { Input, Space, Row, Form, Select, Button } from 'antd'
import { useCallback, useState, useMemo, useRef,useEffect } from 'react'
import * as api from '@/api/models/course'
type KeyType = keyof api.CourseListParams
const requiredKeys: KeyType[] = ['cityId', 'year', 'productType', 'seasonId', 'gradeId', 'subjectId', 'bookVersion']
//

interface FilterProps {
  onSearch: (values: api.CourseListParams) => void
}
interface IOptions {
  label: string
  value: string
  simpleName?:string
}
interface baseInfo {
  label: string
  name: KeyType
  options: IOptions[]
}
function Filter({ onSearch }: FilterProps) {
  const [searchForm] = Form.useForm()
  const schoolRefOptions = useRef<IOptions[]>([])
  const [schoolOptions, setSchoolOptions] = useState<IOptions[]>([])
  //按学校 搜索
  // 搜索年份 schoolCode  searchType:1  sign：1 生成 options
  const [yearOptions, setYearOptions] = useState<IOptions[]>([])
  // 产品类型 增加参数 year 生成 options searchType:2
  const [productTypeOptions, setProductTypeOptions] = useState<IOptions[]>([])
  //学季 增加 productType   searchType:3
  const [seasonIdOptions, setSeasonIdOptions] = useState<IOptions[]>([])
  //年级 增加 seasonId  年级 searchType:4
  const [gradeIdOptions, setGradeIdOptions] = useState<IOptions[]>([])
  //学科 增加 gradeId  学科 searchType:5
  const [subjectIdOptions, setSubjectIdOptions] = useState<IOptions[]>([])
  //版本 增加 subjectId  分类 searchType:6
  const [bookVersionOptions, setBookVersionOptions] = useState<IOptions[]>([])
  const keyMap = useMemo(() => {
    return {
      cityId:setSchoolOptions,
      year:setYearOptions,
      productType:setProductTypeOptions,
      seasonId:setSeasonIdOptions,
      gradeId:setGradeIdOptions,
      subjectId:setSubjectIdOptions,
      bookVersion:setBookVersionOptions,
    }
  },[])
  // 获取学校列表
  const getSchoolCode = useCallback(async () => {
    const res = await api.getSchoolCode()
    const data = res.map(item => ({
      label: item.name,
      value: item.cityCode
    }))
    schoolRefOptions.current = data
    setSchoolOptions(data)
  }, [])
  // 获取学科列表
  useEffect(() => {
    getSchoolCode()
  }, [getSchoolCode])
  // 转换data
  const transformData = useCallback((data: api.ProductListResponse[]): IOptions[] => {
    return data.map(item => ({
      label: (item.schoolName || item.schoolId)!,
      value: item.standardId!,
    }))
  }, [])
  const onValuesChange = async (changedValues:Partial<api.CourseListParams>, allValues:api.CourseListParams) => {
    console.log('Received values of form: ', changedValues, allValues)
    const key = Object.keys(changedValues)[0] as KeyType
    if (!changedValues[key]) return
    switch (key) {
      case 'cityId': {
        const data = await api.getYearData()
        setYearOptions(data.map(item => ({ label: String(item), value: String(item) })))
        break
      }
      case 'year': {
        const data = await api.getProductAttributes({
          schoolCode: allValues.cityId,
          year: changedValues[key],
          searchType: 2,
          sign: 1,
        })
        setProductTypeOptions(transformData(data))
        break
      }
      case 'productType': {
        const data = await api.getProductAttributes({
          schoolCode: allValues.cityId,
          year: allValues.year,
          productType: changedValues[key],
          searchType: 3,
          sign: 1,
        })
        setSeasonIdOptions(transformData(data))
        break
      }
      case 'seasonId': {
        const data = await api.getProductAttributes({
          schoolCode: allValues.cityId,
          year: allValues.year,
          productType: allValues.productType,
          seasonId: changedValues[key],
          searchType: 4,
          sign: 1,
        })
        setGradeIdOptions(transformData(data))
        break
      }
      case 'gradeId': {
        const data = await api.getProductAttributes({
          schoolCode: allValues.cityId,
          year: allValues.year,
          productType: allValues.productType,
          seasonId: allValues.seasonId,
          gradeId: changedValues[key],
          searchType: 5,
          sign: 1,
        })
        setSubjectIdOptions(transformData(data))
        break
      }
      case 'subjectId': {
        const data = await api.getProductAttributes({
          schoolCode: allValues.cityId,
          year: allValues.year,
          productType: allValues.productType,
          seasonId: allValues.seasonId,
          gradeId: allValues.gradeId,
          subjectId: changedValues[key],
          searchType: 6,
          sign: 1,
        })
        setBookVersionOptions(data.map(item => ({ label: item.schoolName!, value: item.schoolId! })))
        break
      }
      default:
        break
    }
  }
  const baseInfo: baseInfo[] = useMemo(() => {
    return [
      {
        label: '年份',
        name: 'year',
        options: yearOptions,
      },
      {
        label: '产品类型',
        name: 'productType',
        options: productTypeOptions,
      },
      {
        label: '学季',
        name: 'seasonId',
        options: seasonIdOptions,
      },
      {
        label: '年级',
        name: 'gradeId',
        options: gradeIdOptions,
      },
      {
        label: '按学科',
        name: 'subjectId',
        options: subjectIdOptions,
      },
      {
        label: '版本',
        name: 'bookVersion',
        options: bookVersionOptions,
      },
    ]
  }, [bookVersionOptions, gradeIdOptions, productTypeOptions, seasonIdOptions, subjectIdOptions, yearOptions])
  // 清除
  const handleClear = useCallback(
    (key: KeyType) => {
      let requiredKeysCopy = [...requiredKeys]
      const index = requiredKeys.findIndex(item => item === key)
      requiredKeysCopy = requiredKeysCopy.slice(index + 1)
      requiredKeysCopy.forEach(item => {
        searchForm.setFieldsValue({ [item]: undefined })
        keyMap[item as keyof typeof keyMap]([])
      })
      // opitions 也需要清除
    },
    [keyMap, searchForm],
  )
  //查询
  const handleSearch = useCallback(() => {
    searchForm.validateFields().then(values => {
      onSearch(values)
    })
    // onSearch(searchForm.getFieldsValue())
  }, [onSearch, searchForm])
  //重置
  const handleReset = useCallback(() => {
    searchForm.resetFields()
  }, [searchForm])
  const handleSchoolSearch = (val:string) => {
   // 筛选
   setSchoolOptions(() => {
    return schoolRefOptions.current?.filter(item => item.label.includes(val))
   })
  }
  // useEffect(() => {
  //   const params = sessionStorage.getItem('courseListParams')
  //   if (params) {
  //     searchForm.setFieldsValue(JSON.parse(params))
  //     const values = JSON.parse(params)
  //     const keys = Object.keys(values) as KeyType[]
  //     keys.forEach(key => {
  //       if (values[key]) {
  //         onValuesChange({ [key]: values[key] }, values)
  //         onSearch(values)
  //       }
  //     })
  //     // options 设置

  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[])
  return (
    <Row justify='start' className='table-search' wrap={true}>
      <Form
        form={searchForm}
        onValuesChange={onValuesChange}
        initialValues={{
          sign: 1,
        }}
      >
        <Row wrap={true}>
          <Form.Item
            name='cityId'
            label='按分校'
            rules={[
              {
                required: true,
                message: '请选择分校',
              },
            ]}
          >
            <Select
              allowClear
              onClear={() => handleClear('cityId')}
              onSearch={handleSchoolSearch}
              style={{ width: 120 }}
              options={schoolOptions || []}
              placeholder='分校名称'
              showSearch
              filterOption={false}

              onChange={() => handleClear('cityId')}
            />
          </Form.Item>
        </Row>
        {/* <Row wrap={true}> */}
        <Form.Item label='按基础信息' className='base-row'>
          <Row wrap={true}>
            {/* <Space> */}
            {baseInfo.map((item, index) => (
              <Form.Item name={item.name} className='row-item' key={item.name}>
                <Select
                  onClear={() => handleClear(item.name)}
                  allowClear
                  disabled={requiredKeys.slice(0, index + 1).some(key => !searchForm?.getFieldValue(key))}
                  style={{ width: 120 }}
                  options={item.options || []}
                  placeholder={item.label}
                  onChange={() => handleClear(item.name)}
                />
              </Form.Item>
            ))}
            {/* </Space> */}
          </Row>
        </Form.Item>
        {/* </Row> */}
        <Row wrap={true}>
          <Form.Item name='id' label='产品ID'>
            <Input placeholder='产品ID' allowClear/>
          </Form.Item>
          <Form.Item name='name' label='产品名称'>
            <Input placeholder='产品名称' allowClear/>
          </Form.Item>

          <Form.Item style={{ marginLeft: '15px' }}>
            <Space>
              <Button size='middle' onClick={handleSearch} type="primary">查找</Button>
              <Button size='middle' onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
    </Row>
  )
}

export default Filter
