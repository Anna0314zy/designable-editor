/*
 * @Date: 2022-11-30 15:27:50
 * @LastEditors: zouyu p_zouyu@ledupeiyou.com
 * @LastEditTime: 2023-12-29 19:15:32
 * @FilePath: /slides-engine/play/src/api/upload.ts
 */
import api,{ host } from "./index";
import { retryRequest } from '../utils/task'
export interface IFile {
  cosFullPath: string;
  resourceFormat: string;
  resourceType: string; // pic
  fileSize: number;
  fileName: string;
  fileMd5: string;
  fileType:string
}
export interface IUploadFile extends IFile {
  width: number;
  height: number;
  localUrl?: string;
  id:number | string
  status?:string
  percent?:number
  elementId?:string
  uploadPercent?:number
}
export interface IResourceFile extends IFile {
  width: number;
  height: number;
  id:number | string
  status?:string
}


// 获取md5资源
export const getResource = async (md5): Promise<IResourceFile> => {

  return api.get(
    `${host}/classroom-slides/resources/${md5}`,{},{
      transformResponse:(res)=> {
      const data = JSON.parse(res)
      if(data.code !== 200) {
        return {
          code:200,
          data:{}
        }
      }
      return data
      }
    }
  );
};
interface IResource {
  cosFullPath: string;
  fileMd5: string;
  fileName: string;
  fileSize: number;
  height: number;
  resourceFormat: string;
  resourceType: string;
  width: number;
}

// 保存上传资源
export const createResource = (params?: IResource): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/resources/create`,
    params
  );
};

// 获取资源路径、CDN定义
export const getCosConfig = async (): Promise<any> => {
  return api.get(
    `${host}/classroom-slides/resources/cos/config`
  );
};
// 获取cos临时访问token
export const getCosCredential = async (): Promise<any> => {
  return api.get(
    `${host}/classroom-slides/resources/cos/credential`
  );
};
// 保存课件与资源映射关系
export const addResourceRelation = async (params?: object): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/slides/pages/resource-relation/save`,
    params
  );
};

// 删除课件与资源映射关系
export const removeResourceRelation = async (params?: object): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/slides/pages/resource-relation/delete`,
    params
  );
};
// 增加任务
// export const addTask = (params?: object): Promise<any> => {
//   return api.post(
//     `${host}/classroom-slides/slides/pages/course-tasks/add`,
//     params
//   );
// };
export const editTask = ({
	slideId,
	pageId,
	elementId,
	courseTaskList,
}: {
	slideId: string;
	pageId: string;
	elementId: string;
	courseTaskList: any[];
}): Promise<any> => {
  const cb = () => api.post(
		`${host}/classroom-slides/slides/pages/${pageId}/course-tasks/${elementId}/edit`,
		{ slideId, pageId, courseTaskList })
  return retryRequest(cb)
};
//删除任务
export const removeTask = (params:{pageId:string;elementId:string}): Promise<any> => {
  const {pageId,elementId} = params
  return api.post(
    `${host}/classroom-slides/slides/pages/${pageId}/course-tasks/${elementId}/delete`,
    params
  );
};
