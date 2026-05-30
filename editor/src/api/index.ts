/*
 * @Date: 2022-11-08 15:15:16
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-07 09:43:33
 * @FilePath: /slides-engine/editor/src/api/index.ts
 */
import Axios, {AxiosResponse,AxiosRequestConfig } from "axios";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { getToken, getUrlParameter } from "../utils/common";

interface AxiosConfig {
  timeout: number;
  headers: {
    "Content-Type": string;
    "Online_trace_id": string,
    "Token": string,
    "SlideId": string
  };
}
const config: AxiosConfig = {
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
    "Online_trace_id": `slides_${uuidv4()}`,
    "Token":getToken(),
    "SlideId": getUrlParameter('id')
  },
};
// const hostMap = {
//   test: 'https://test-class-api-online.saasp.vdyoo.com'
// }

const axios = Axios.create(config);

// const router: CommonObjectType = new HashRouter({})

// 请求前拦截
axios.interceptors.request.use(
  (req) => {
    // const { token = '' } = store.getState().user.UserInfo || {}
    // req.headers.token = localStorage.getItem("token");
    // if (req.url.endsWith("download")) {
    //   req.responseType = "blob";
    // }
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export interface ResponseData<T = any> {
  data: T
  message: string
  code: number
}
// 返回后拦截
axios.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    // todo 应考虑在全局统一化响应数据格式.如果没有,则应移除这个拦截器
    const { data, message: msg, code } = response.data;
    console.log(data, 787878);
    if (code !== 200) {
      message.error(msg);
      if (code === 1001001) {
        const regex = /(\d+\.\d+\.\d+)/;
        const TaskVersion = localStorage.getItem("TaskVersion");
        const HomeUrl = import.meta.env.VITE_HOME_SERVER.replace(
          regex,
          TaskVersion || "1.0.0"
        );
        location.replace(HomeUrl)
      }
      return Promise.reject(data);
    } else {
      return Promise.resolve(data);
    }
  },
  (err) => {
    message.destroy();
    message.error("请求失败");
    return Promise.reject(err);
  }
);

// post请求
// eslint-disable-next-line
// @ts-ignore
const http = {
  get: <T>(url: string, params: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.get(url, {
      params,
      ...(configs || {}),
    })
  },
  post: <T>(url: string, data: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.post(url, data, configs)
  },
  put: <T>(url: string, data: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.put(url, data, configs)
  },
  del: <T>(url: string, data: Record<string, any> = {}, configs?: AxiosRequestConfig): Promise<T> => {
    return axios.delete(url, {
      data,
      ...(configs || {}),
    })
  },
}
export default http;
export const host = import.meta.env.VITE_API_SERVER
