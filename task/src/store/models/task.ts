import * as api from '@/api/models/task'
import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { IConfigData} from './types/tasks'
import { cloneDeep } from 'lodash-es'
import { RootState } from '@/store'
import {
	ITask
} from "@editor/typing";
import { getAllSchema,getSchema } from '@/store/utils'
export interface TaskState {
  tasks: ITask[]
  schema: IConfigData[][]
  minRewardPercent: number
  maxRewardPercent: number
  currentTaskId: string | number
  btnEditable: {
    [key: string]: boolean
  }
}

export default createModel<RootModel>()({
  state: {
    tasks: [],
    schema: [],
    minRewardPercent: 0.1,
    maxRewardPercent: 1,
    currentTaskId: '',
    btnEditable: {}, // 默认不可编辑
  } as TaskState,
  reducers: {
    // 更新所有的数据 全局覆盖
    updateData(state, payload: Partial<TaskState>) {
      return Object.assign({}, state, payload)
    },
    updateBtnEditable(state, payload: { [key: string]: boolean }) {
      
      return {
        ...state,
        btnEditable: {
          ...state.btnEditable,
          ...payload,
        }
      }
    },
    updateTaskById(state, payload: Partial<ITask>) {
      const { id } = payload
      state.tasks = state.tasks.map(item => {
        if (item.id === id) {
          return Object.assign(item, payload)
        }
        return item
      })
    },
  },
  effects: dispatch => ({
    async updateSchemaById(payload: Partial<IConfigData>, rootState) {
      const { id, taskType } = payload
      const schema = cloneDeep(rootState.task.schema)
      schema.forEach(item => {
        let target = item.find(itm => itm.id === id && itm.taskType === taskType)
        if (target) {
          target = Object.assign(target, payload)
        }
      })
      dispatch.task.updateData({ schema })
    },
    async addSchema(payload: { tasks: ITask[] }, rootState: RootState) {
      // 增加schema
      const schema = cloneDeep(rootState.task.schema)
      const { tasks } = payload
      tasks.forEach((task: ITask, index: number) => {
        schema.push(getSchema(task, index, tasks))
      })
      dispatch.task.updateData({ schema })
    },
    async addTasks(payload: { tasks: ITask[] }, rootState: RootState) {
      // 增加任务的时候 需要更新schema 数据
      const { tasks } = payload
      const newSchema = getAllSchema(tasks)
      dispatch.task.updateData({
        tasks: rootState.task.tasks.concat(tasks),
        schema: rootState.task.schema.concat(newSchema),
      })
    },
    async updateTask(payload: { pageId: string; data: ITask[] }, rootState) {
      //更新数据
      const { pageId, data } = payload
      // data 里面的数据是更新后的数据
      const tasks = rootState.task.tasks
      const filterData = tasks.filter(item => item.pageId === pageId && data.map(itm => itm.id).includes(item.id))
      const newTasks = filterData.map(item => {
        if (item.pageId === pageId) {
          const task = data.find(itm => itm.id === item.id)
          if (!task) {
            return item
          }
          return Object.assign({}, item, task)
        }
        return item
      })
      dispatch.task.updateData({ tasks: newTasks })
      dispatch.task.addSchema({ tasks: newTasks })
    },
    async getAllTaskList(payload: { slideId: string }) {
      // 获取课件任务列表
      const { slideId } = payload
      // const res = await api.getTaskList({ pageId: rootState.page.currentPage.id })
      const res = await api.getAllTaskList({ slideId, taskType: '' })
      const data: ITask[] = []
      res?.courseTaskList?.forEach(itm => {
        const { taskExt, ...rest } = itm
        data.push({
          ...rest,
          taskExt,
          ...(taskExt || {}),
        })
      })
      const newSchema = getAllSchema(data)
      // 如果当前页面不可编辑
      dispatch.task.updateData({ tasks: data, schema: newSchema })
    },
    // async changeBtnEditable(payload,rootState:RootState) {
    // const pageId = rootState.page.currentPage.id
    // const schema = rootState.task.schema.filter(item => item.filter(itm => itm.pageId === pageId))
    //   dispatch.task.updateData({ btnEditable: payload ,schema})
    // }
  }),
})
