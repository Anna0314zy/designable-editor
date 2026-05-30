
import api from '../index'
const http = import.meta.env.VITE_API_SERVER
// 获取学校code
export const getSchoolCode = () => {
  return api.get<{ name: string; cityCode: string;simpleName:string }[]>(
    `${http}/classroom-slides/base-data/school/list`,
  )
}
// 获取年份
export const getYearData = () => {
  return api.get<number[]>(
    `${http}/classroom-slides/base-data/year/list`,
  )
}
// 筛选条件接口
export interface FilterParams {
  searchType: number
  year: string
  productType: string
  seasonId: string
  gradeId: string
  subjectId: string
  categoryId: string
  schoolCode: string
  auditStatus: string
  status: string
  sign: number
}
export interface ProductListResponse {
  schoolId?: string
  schoolName?: string // 先取值 schoolName 再取值 schoolId
  sortOrder: number
  standardId: string
}
export const getProductAttributes = (params: Partial<FilterParams>) => {
  return api.post<ProductListResponse[]>(
    `${http}/classroom-slides/forward/bedrock-course/pyProduct/findProductAttributes`,
    params,
  )
}
export interface CourseListItem {
  productTypeName: string
  id: string
  cityName: string
  year: string
  seasonName: string
  gradeName: string
  subjectName: string
  bookVersionName: string
  name:string
}
// 获取课件页列表
export interface CourseListResponse {
  records: CourseListItem[]
  current: number
  size: number
  total: number
}
export interface CourseListParams {
  cityId?: string
  pageNo: number
  pageSize: number
  // 以下都是非必选
  bookVersion?: string
  gradeId?: string
  id?: string
  name?: string
  productType?: string
  seasonId?: string
  subjectId?: string
  year?: string
}
export const getClassList = (params: CourseListParams) => {
  return api.post<CourseListResponse>(
    `${http}/classroom-slides/forward/bedrock-course/pyProduct/findProductList`,
    params,
  )
}
//课包课次详情接口
// export interface CourseDetailParams {
//   id: string
// }

interface SlideDetailResponse {
  bindSlideDtoList: {
    mainId: string //产品id
    slideId?: string
    serialNumber?: string
    name?: string
    lessonInformation?: string
  }[]
}
// 获取课件绑定信息的接口
export const getSlideDetail = (params: { productId: string }) => {
  return api.get<SlideDetailResponse>(`${http}/classroom-slides/lesson-packages/${params.productId}`)
}
export interface CourseDetailResponse {
  noNameBeanList: {
    no: number | string
    name: string
  }[]
}
// 获取课次详情接口
export const getProductOutline = (params: { productId: string }) => {
  return api.get<CourseDetailResponse>(
    `${http}/classroom-slides/forward/bedrock-course/pyProductOutline/findProductOutline`,
    params,
  )
}
interface AddCourseParams {
  mainId:string;
  serialNumber:string;
  lessonInformation:string
}
//  新增课程信息
export const addLessonInformation = (params: AddCourseParams) => {
  return api.post(`${http}/classroom-slides/lesson-packages/lesson-information/add`, params)
}