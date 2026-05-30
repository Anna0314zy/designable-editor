import { useEffect, useRef } from 'react'
import { getSysToken, getToken } from '../../utils/auth'
import { Dispatch } from '@/store'
import { useDispatch } from 'react-redux'

const WithCheck = (Component: any) => {
  return function WithCheckComponent(props:any) {
    const dispatch = useDispatch<Dispatch>()
    // 设置一个定时器刷新token
    const timer = useRef<any>()
    //  需要校验token 以及 刷新token
    useEffect(() => {
      const login = async () => {
        getSysToken()
        if (import.meta.env.MODE === 'dev') return
        await dispatch.auth.login()
        await dispatch.auth.checkLogin()
      }
      login()
      const checkLogin = async () => {
        await dispatch.auth.checkLogin()
      }
      timer.current = setInterval(() => {
        checkLogin()
      }, 1000 * 60 * 30)
      return () => {
        clearInterval(timer.current)
      }
    }, [dispatch.auth])
    return <Component {...props} />;
  }
}

export default WithCheck