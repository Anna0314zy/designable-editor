/*
 * @Date: 2024-01-15 11:19:25
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-01 10:04:07
 * @FilePath: /slides-engine/editor/src/api/auth.ts
 */

import api from "./index";
import {host} from '.'// 更新

export interface AuthUser {
  id: string
  username: string
  roles: string[]
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface AuthCredentials {
  username: string
  password: string
}

interface SystemVersionParams {
  systemName: string
}

interface SystemVersion {
  systemName: string
  currentVersion?: string
  version?: string
}

// 注册
export const register = (params: AuthCredentials): Promise<AuthSession> => {
  return api.post(`${host}/classroom-slides/auth/register`, params, { headers: { skipAuthRefresh: true } })
}

// 登录
export const login = (params: AuthCredentials): Promise<AuthSession> => {
  return api.post(`${host}/classroom-slides/auth/login`, params, { headers: { skipAuthRefresh: true } })
}

// 刷新登录态
export const refreshToken = (): Promise<AuthSession> => {
  return api.post(`${host}/classroom-slides/auth/refresh`, {}, { headers: { skipAuthRefresh: true } })
}

// 退出登录
export const logout = (): Promise<{ success: boolean }> => {
  return api.post(`${host}/classroom-slides/auth/logout`)
}

// 获取版本号
export const getSysVersion = ({ systemName }: SystemVersionParams): Promise<SystemVersion> => {
  return api.get(
    `${host}/classroom-slides/manage/${systemName}/current-version`
  );
};

// 设置版本号
export const setSysVersion = (params: SystemVersionParams & { version?: string }): Promise<SystemVersion> => {
  return api.post(
    `${host}/classroom-slides/manage/system/version/save-or-update`,
    params
  );
};
