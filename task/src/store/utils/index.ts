import { IConfigData,rewardExtra, taskSchema} from '../models/types/tasks'
import {
	ITask
} from "@editor/typing";
import { groupBy, omit } from 'lodash-es'
// taskSchema 根据 传过来的 默认数据 生成对应的表单配置
/**
 *
 * @param data 跟 taskSchema 对比 只需要data 里面有的字段 表单里的默认值 在data 里面取值
 * extraConfig schema 生成任务时确认的固定配置
 */
export const genFilterSchema = (data: ITask, extraConfig: IConfigData[] = []): IConfigData[] => {
  // 删除 任务重试这一项 没有使用场景 前端暂时不展示
    const filterTaskSchema = taskSchema.filter(item => item.taskType !== 'retryStatus')
    const filterSchema = filterTaskSchema.concat(extraConfig).filter(item => Object.keys(data).includes(item.taskType as string))
    return filterSchema.map(item => {
      return Object.assign({}, item, {
        default: data[item.taskType],
        id: data.id,
        pageId: data.pageId,
        name: item.name,
      })
    })
  }
  export const getSchema = (task: ITask, index: number, tasks: ITask[]) => {
    let schema: IConfigData[] = []
  
    // 每个任务都有自己固定的键值 需要根据不同的任务类型生成不同的schema
    switch (task.groupName) {
      case 'coinBank':
        {
          schema = genFilterSchema(omit(task, ['words', 'countdownDisplay']),rewardExtra)
          schema.forEach(item => {
            if (['endMethod', 'skipStatus'].includes(item.taskType)) {
              item.editable = true
            }
          })
        }
        break
      case 'pkGame':
        {
          schema = genFilterSchema(omit(task))
          // 生成pk游戏的schema
          schema.forEach(item => {
            if (['followUpLinkageType','countdownDisplay'].includes(item.taskType)) {
              item.editable = true
            }
          }) 
        }
        break
      case 'praiseBoard':
        {
          schema = genFilterSchema(task)
          // 生成pk游戏的schema
          schema.forEach(item => {
            if (item.taskType === 'followUpLinkageType') {
              item.editable = true
            }
          })
        }
        break
      case 'normal': {
        schema = genFilterSchema(omit(task, ['countdownDisplay']))
        schema.forEach(item => {
          if (['endMethod', 'skipStatus', 'retryStatus','followUpLinkageType'].includes(item.taskType)) {
            item.editable = true
          }
        })
        break
      }
      case 'normalGame': {
        schema = genFilterSchema(omit(task, ['words']))
        schema.forEach(item => {
          if (['endMethod', 'skipStatus', 'followUpLinkageType'].includes(item.taskType)) {
            item.editable = true
          }
        })
        break
      }
      case 'starRainingGame': {
        schema = genFilterSchema(omit(task, ['words']), [
          {
            taskType: 'coinAmount',
            type: 'radio',
            name:'奖励金币',
            options: [
              { name: '100金币', value: '100' },
              { name: '200金币', value: '200' },
              { name: '300金币', value: '300' },
            ],
          },
        ])
        schema.forEach(item => {
          if (['endMethod', 'skipStatus'].includes(item.taskType)) {
            item.editable = true
          }
        })
        break
      }
      case 'workGame': {
        schema = genFilterSchema(omit(task, ['words']))
         schema.forEach(item => {
            if (item.taskType === 'followUpLinkageType') {
              item.editable = true
            }
          })
        break
      }
      case 'playVideo': {
        schema = genFilterSchema(omit(task, ['words', 'countdownDisplay']))
        if (index === tasks.length - 1) {
          schema.forEach(item => {
            if (item.taskType === 'followUpLinkageType') {
              item.editable = true
            }
          })
        }
        break
      }
      default:
        schema = genFilterSchema(task)
        break
    }
  
    return schema
  }
  export const getAllSchema = (tasks: ITask[]) => {
    // tasks 按照 groupId 分组
    const schema: IConfigData[][] = []
    const grouped = groupBy(tasks, 'groupId');
    Object.keys(grouped).forEach((key) => {
      const groupByTask = grouped[key]
      groupByTask.forEach((task: ITask, index: number) => {
        const data = getSchema(task, index, groupByTask)
        schema.push(data.map(item => ({ ...item })))
      })
    })
    return schema
  }
