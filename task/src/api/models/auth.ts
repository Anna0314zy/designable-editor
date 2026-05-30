/*
 * @Date: 2024-01-05 20:27:50
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-15 10:45:06
 * @FilePath: /slides-engine/task/src/api/models/auth.ts
 */
import api from '../index'
const http = import.meta.env.VITE_API_SERVER
export interface LoginResponse {
    systemToken: string
}
// 登录
export const login = (params: { systemToken:string }):Promise<LoginResponse> => {
    return api.post(`${http}/classroom-slides/auth/login`, params)
}

// 更新
export const checkLogin = (params: { systemToken:string }):Promise<LoginResponse> => {
    return api.post(`${http}/classroom-slides/auth/check`,params)
}

// 获取版本号
export const getSysVersion = (params: { systemName: string | unknown }, token: string): Promise<any> => {
    return api.get(
      `${http}/classroom-slides/manage/${params.systemName}/current-version`, undefined,{
        headers: {
            Token: token
        }
      }
    );
};

// 设置版本号
export const setSysVersion = (params: { systemName: string | unknown }): Promise<any> => {
    return api.post(
      `${http}/classroom-slides/manage/system/version/save-or-update`,
      params
    );
};