/*
 * @Date: 2024-01-15 11:19:25
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-01 10:04:07
 * @FilePath: /slides-engine/editor/src/api/auth.ts
 */

import api from "./index";
import {host} from '.'// 更新

// 更新token
export const updateSysToken = (params: { systemToken:string }): Promise<any> => {
    return api.post(
      `${host}/classroom-slides/auth/check`,
      params
    );
};

// 获取版本号
export const getSysVersion = ({ systemName }): Promise<any> => {
  return api.get(
    `${host}/classroom-slides/manage/${systemName}/current-version`
  );
};

// 设置版本号
export const setSysVersion = (params): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/manage/system/version/save-or-update`,
    params
  );
};