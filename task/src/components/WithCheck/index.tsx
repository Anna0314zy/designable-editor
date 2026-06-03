import { useEffect } from 'react'
import { getToken } from '../../utils/auth'
import { Dispatch } from '@/store'
import { useDispatch } from 'react-redux'

const WithCheck = (Component: any) => {
  return function WithCheckComponent(props:any) {
    const dispatch = useDispatch<Dispatch>()
    useEffect(() => {
      const loadCurrentUser = async () => {
        if (!getToken()) return
        await dispatch.auth.fetchCurrentUser()
      }
      loadCurrentUser()
    }, [dispatch.auth])
    return <Component {...props} />;
  }
}

export default WithCheck
