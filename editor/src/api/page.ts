/*
 * @Date: 2022-11-08 15:30:22
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-09 17:01:30
 * @FilePath: /slides-engine/editor/src/api/page.ts
 */
import api from "./index";
import {host} from '.'
// 创建课件页id
export const createPageId = (params: any): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/slides/pages/create`,
    params
  );
};

// 删除课件页
export const deletePage = (params: any): Promise<any> => {
    return api.post(
      `${host}/classroom-slides/slides/pages/delete`,
      params
    );
};

// 保存课件页
export const savePage = (params: any): Promise<any> => {
    const {pageId, ...others} = params
    return api.post(
      `${host}/classroom-slides/slides/pages/${pageId}/save`,
      {
        ...others
      }
    );
};