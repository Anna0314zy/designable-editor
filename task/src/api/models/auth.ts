/*
 * @Date: 2024-01-05 20:27:50
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-15 10:45:06
 * @FilePath: /slides-engine/task/src/api/models/auth.ts
 */
import api from '../index'
import { AuthSession, AuthUser } from '@/utils/auth'
const http = import.meta.env.VITE_API_SERVER

export interface AuthCredentials {
    username: string
    password: string
}

// 注册
export const register = (params: AuthCredentials): Promise<AuthSession> => {
    return api.post(`${http}/classroom-slides/auth/register`, params, { headers: { skipAuthRefresh: true } })
}

// 登录
export const login = (params: AuthCredentials): Promise<AuthSession> => {
    return api.post(`${http}/classroom-slides/auth/login`, params, { headers: { skipAuthRefresh: true } })
}

// 刷新登录态
export const refreshToken = (): Promise<AuthSession> => {
    return api.post(`${http}/classroom-slides/auth/refresh`, {}, { headers: { skipAuthRefresh: true } })
}

// 退出登录
export const logout = (): Promise<{ success: boolean }> => {
    return api.post(`${http}/classroom-slides/auth/logout`)
}

// 当前用户
export const getCurrentUser = (): Promise<AuthUser> => {
    return api.get(`${http}/classroom-slides/auth/me`)
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
