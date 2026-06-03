/*
 * @Date: 2022-11-08 15:30:22
 * @LastEditors: zouyu p_zouyu@ledupeiyou.com
 * @LastEditTime: 2024-01-02 18:06:14
 * @FilePath: /slides-engine/play/src/api/slides.ts
 */
import api from "./index";
import {host} from '.'
// 创建课件id
export const createSlidesId = (): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/slides/create`,
  );
};
// 保存课件
export const saveSlides = (params: any): Promise<any> => {
    return api.post(
      `${host}/classroom-slides/slides/${params.slideId}/save`,
      {
        slideStructure: params.slideStructure
      }
    );
};
// 发布课件
export const publishSlides = (params: any): Promise<any> => {
    return api.post(
      `${host}/classroom-slides/slides/${params.slideId}/publish`
    );
};

// 取消发布课件
export const cancelPublishSlides = (params: any): Promise<any> => {
    return api.post(
      `${host}/classroom-slides/slides/${params.slideId}/cancel-publish`
    );
};

// 获取课件
export const getSlides = (params: any): Promise<any> => {
    const {slideId, ...others} = params
    return api.get(
      `${host}/classroom-slides/slides/${slideId}`,
      {...others}
    );
};

// 课件上锁
export const canEdit = (params: any): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/slides/${params.slideId}/go-to-edit`
  );
};

// 课件解锁
export const exitEdit = (params: any): Promise<any> => {
  return api.post(
    `${host}/classroom-slides/slides/${params.slideId}/exit-edit`,
    { lockToken: params.lockToken }
  );
};

// 课包课次绑定课件
export const bindSlides = (params: {
	mainId: string;
	serialNumber: string;
	slideId: string;
  slideTitle:string
}): Promise<any> => {
	return api.post(
		`${host}/classroom-slides/lesson-packages/bind-slide`,
		params
	);
};
