import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { clearAuthSession, getToken, LoginUrl, setAuthSession } from '@/utils/auth'
const request = axios.create({
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const apiBaseUrl = import.meta.env.VITE_API_SERVER
let refreshPromise: Promise<string | null> | null = null

const redirectToLogin = () => {
  clearAuthSession()
  if (!window.location.hash.startsWith('#/login')) {
    const redirect = encodeURIComponent(window.location.href)
    window.location.hash = `${LoginUrl}?redirect=${redirect}`
  }
}

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = request
      .post(`${apiBaseUrl}/classroom-slides/auth/refresh`, {}, { headers: { skipAuthRefresh: true } })
      .then((session) => {
        setAuthSession(session as any)
        return (session as any).accessToken as string
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

request.interceptors.request.use(
  config => {
    const token = getToken()
    if(token && !config.headers?.skipAuthRefresh) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

export interface ResponseData<T = any> {
  data: T
  message: string
  code: number
}

request.interceptors.response.use(
  (res: AxiosResponse<ResponseData>) => {
    try {
      if (res.status >= 200 && res.status < 300) {
        const { data, message: msg, code } = res.data

        if (code === 200) {
          return data
        } else if(Number(code) === 1001001 || Number(code) === 401) {
          message.error('登录过期，请重新登录')
          redirectToLogin()
        } else {
          console.log('%c msg', 'color: #00b33c;', msg)
          if (msg) message.error(msg)
          return Promise.reject(res.data)
        }
      }
    } catch (err: any) {
      console.log('%c err', 'color: #00b33c;', err)
      if (err?.body) {
        const body = JSON.parse(err?.body)
        if (body?.message) message.error(body?.message)
        return body
      }
 
    }
  },
  async err => {
    const originalConfig = err?.config
    if (err?.response?.status === 401 && originalConfig && !originalConfig._retry && !originalConfig.headers?.skipAuthRefresh) {
      originalConfig._retry = true
      const nextToken = await refreshAccessToken()
      if (nextToken) {
        originalConfig.headers.Authorization = `Bearer ${nextToken}`
        return request(originalConfig)
      }
      message.error('登录过期，请重新登录')
      redirectToLogin()
    }
    message.error(err?.message)
    return Promise.reject(err?.response?.data || err)
  },
)

const http = {
  get: <T>(url: string, params: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return request.get(url, {
      params,
      ...configs,
    })
  },
  post: <T>(url: string, data: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return request.post(url, data, configs)
  },
  put: <T>(url: string, data: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return request.put(url, data, configs)
  },
  del: <T>(url: string, data: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return request.delete(url, {
      data,
      ...configs,
    })
  },
}
export default http
