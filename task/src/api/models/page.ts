import api from '../index'
const http = import.meta.env.VITE_API_SERVER
import { PageType } from '@editor/react'

export interface FileList {
  cosFullPath: string
  fileMd5: string
  fileName: string
  fileSize: number
  resourceType:string
}
interface SlideResponse {
  slideId: string
  slideStructure: string
  pageContentDtoList: {
    pageId:string;
    pageType:PageType;
    mainContentStructure: string
    fileResourceDtoList: FileList[]
  }[]
}
// 创建课件id
export const createSlidesId = (): Promise<any> => {
  return api.post(
    `${http}/classroom-slides/slides/create`,
  );
};
// 获取课件列表
export const getSlideList = ({ slideId }: { slideId: string }) => {
  return api.get<SlideResponse>(`${http}/classroom-slides/slides/${slideId}?containedAllResourcesFlag=true`)
}

// 发布课件
export const publishSlides = ({ slideId }: { slideId: string }) => {
  return api.post(`${http}/classroom-slides/slides/${slideId}/publish`);
};

// 取消发布课件
export const cancelPublishSlides = ({ slideId }: { slideId: string }) => {
  return api.post(`${http}/classroom-slides/slides/${slideId}/cancel-publish`);
};

// 课包课次绑定课件
export const bindSlides = (params: {
	mainId: string |  undefined;
	serialNumber: string;
	slideId: string;
  slideTitle:string | undefined;
}): Promise<any> => {
	return api.post(
		`${http}/classroom-slides/lesson-packages/bind-slide`,
		params
	);
};