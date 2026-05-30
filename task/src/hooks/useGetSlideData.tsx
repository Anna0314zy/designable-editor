import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch, RootState } from '@/store'
import { useSelector  } from 'react-redux'
export const useGetSlideData = (getList = true) => {
  const dispatch = useDispatch<Dispatch>()
  const {
    currentPage,
  } = useSelector((state: RootState) => state.page)
  const { id } = useParams()
  const searchParams = new URLSearchParams(window.location.search)
  const pageId = searchParams.get('pageId') as string
  // 获取课件页信息
  useEffect(() => {
    if (id && !currentPage?.id && getList) dispatch.page.getSlideList({ slideId: id, pageId })
  }, [currentPage?.id, dispatch.page, getList, id, pageId])
  return null
}
