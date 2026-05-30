import api from '../index'
const http = import.meta.env.VITE_API_SERVER
import {BaseTaskKey} from '@/store/models/types/tasks'
// 红包任务扩展字段
interface RewardExt {
    rewardSkin?: string
    rewardPercent?: number

}
export interface TaskParams extends BaseTaskKey{
    taskExt?: RewardExt
}
export interface SaveParams {
    slideId: string
    pageId: string
    courseTaskList: TaskParams[]
    // 任务扩展字段
}
//保存任务

export const saveTask = (params: SaveParams) => {
    return api.post(`${http}/classroom-slides/slides/pages/course-tasks/save`, params)
}
export interface AddTaskParams {
    slideId: string
    pageId: string
    courseTaskList: Omit<TaskParams,'sortIndex'>[]
        // 任务扩展字段
}
// 新增任务
export const addTask = (params: AddTaskParams) => {
    return api.post(`${http}/classroom-slides/slides/pages/course-tasks/add`, params)
}
// 获取任务 
export const getTaskList = (params: {pageId:string}) => {
    const { pageId } = params
    return api.get(`${http}/classroom-slides/slides/pages/${pageId}/course-tasks`, params)
}

//获取课件所有任务
export const getAllTaskList = (params: {slideId:string,taskType?:string}) => {
    return api.get<{courseTaskList:TaskParams[],pageId:string}>(`${http}/classroom-slides/slides/pages/course-tasks`, params)
}
// 根据内容删除任务
export const deleteTask = (params: {pageId:string,elementId:string}) => {
    const { pageId,elementId } = params
    return api.del(`${http}/classroom-slides/slides/pages/${pageId}/course-tasks/${elementId}/delete`, params)
}