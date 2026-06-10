/*
 * @Date: 2022-11-08 15:15:16
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-07 09:43:33
 * @FilePath: /slides-engine/editor/src/api/index.ts
 */
import Axios, {AxiosResponse,AxiosRequestConfig } from "axios";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { clearToken, getToken, getUrlParameter, setToken } from "../utils/common";

interface AxiosConfig {
  timeout: number;
  withCredentials: boolean;
  headers: {
    "Content-Type": string;
    "Online_trace_id": string,
    "Authorization": string,
    "SlideId": string
  };
}
interface AuthSession {
  accessToken: string
}
type AuthRequestConfig = AxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
}
const config: AxiosConfig = {
  timeout: 600000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Online_trace_id": `slides_${uuidv4()}`,
    "Authorization": getToken() ? `Bearer ${getToken()}` : '',
    "SlideId": getUrlParameter('id')
  },
};
// const hostMap = {
//   test: ''
// }

const axios = Axios.create(config);
const apiBaseUrl = import.meta.env.VITE_API_SERVER
let refreshPromise: Promise<string | null> | null = null

const redirectToHome = () => {
  clearToken()
  // const regex = /(\d+\.\d+\.\d+)/;
  // const TaskVersion = localStorage.getItem("TaskVersion");
  // const HomeUrl = import.meta.env.VITE_HOME_SERVER.replace(
  //   regex,
  //   TaskVersion || "1.0.0"
  // );
  location.replace(`${window.location.origin}#/login?redirect=${encodeURIComponent(window.location.href)}`)
}

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${apiBaseUrl}/classroom-slides/auth/refresh`, {}, {
        headers: { skipAuthRefresh: true },
        withCredentials: true,
      })
      .then((session) => {
        const accessToken = (session as unknown as AuthSession)?.accessToken
        if (accessToken) setToken(accessToken)
        return accessToken || null
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// const router: CommonObjectType = new HashRouter({})

// 请求前拦截
axios.interceptors.request.use(
  (req) => {
    const skipAuthRefresh = Boolean(req.headers?.skipAuthRefresh)
    if (skipAuthRefresh) {
      const authReq = req as typeof req & { skipAuthRefresh?: boolean }
      authReq.skipAuthRefresh = true
      if (typeof req.headers.delete === 'function') {
        req.headers.delete('skipAuthRefresh')
      } else {
        delete (req.headers as unknown as Record<string, unknown>).skipAuthRefresh
      }
    }
    const token = getToken()
    if (token && !skipAuthRefresh) {
      req.headers.Authorization = `Bearer ${token}`
    }
    // if (req.url.endsWith("download")) {
    //   req.responseType = "blob";
    // }
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export interface ResponseData<T = unknown> {
  data: T
  message: string
  code: number
}
// 返回后拦截
axios.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    console.log('api response.data=----',response.data)
    // todo 应考虑在全局统一化响应数据格式.如果没有,则应移除这个拦截器
    const { data, message: msg, code } = response.data;
    if (code !== 200) {
      message.error(msg);
      if (code === 1001001 || code === 401) {
        redirectToHome()
      }
      return Promise.reject(data) as never;
    } else {
      return data as never;
    }
  },
  async (err) => {
    message.destroy();
    const originalConfig = err?.config as AuthRequestConfig | undefined
    const skipAuthRefresh = Boolean(originalConfig?.skipAuthRefresh || originalConfig?.headers?.skipAuthRefresh)

    if (err?.response?.status === 401 && skipAuthRefresh) {
      return Promise.reject(err) as never;
    }
    if (err?.response?.status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true
      const nextToken = await refreshAccessToken()
      if (nextToken && originalConfig && originalConfig.headers) {
        originalConfig.headers.Authorization = `Bearer ${nextToken}`
        return axios(originalConfig) as never
      }
      message.error("登录过期，请重新登录");
      redirectToHome()
    } else if (err?.response?.status === 401) {
      message.error("登录过期，请重新登录");
      redirectToHome()
    } else {
      message.error("请求失败");
    }
    return Promise.reject(err) as never;
  }
);

// post请求
// eslint-disable-next-line
// @ts-ignore
const http = {
  get: <T>(url: string, params: object = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.get(url, {
      params,
      ...(configs || {}),
    })
  },
  post: <T>(url: string, data: object = {}, configs?: AxiosRequestConfig): Promise<T> => {
    console.log('http-post',url)
    return axios.post(url, data, configs)
  },
  put: <T>(url: string, data: object = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.put(url, data, configs)
  },
  del: <T>(url: string, data: object = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.delete(url, {
      data,
      ...(configs || {}),
    })
  },
}
export default http;
export const host = import.meta.env.VITE_API_SERVER
