import { useCallback, useState } from 'react'
import { message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, Dispatch } from '@/store'
import { ITask } from '@editor/typing'
import { checkTaskData } from '@/utils'
import * as api from '@/api/models/task'
export const useSaveTask = (form: any) => {
  const dispatch = useDispatch<Dispatch>()
  const { btnEditable } = useSelector((state: RootState) => state.task)
  const { slides,currentPage } = useSelector((state: RootState) => state.page)
  const [loading, setLoading] = useState(false)
  const getEditable = useCallback((pageId:string) => btnEditable[pageId], [btnEditable])
  const handleSubmit = useCallback((pageId:string,autoSave=false) => {
    const editable = getEditable(pageId)
    if (!editable && !autoSave) dispatch.task.updateBtnEditable({ [pageId] : !editable })
    if (!editable) return
    return form.validateFields().then(async values => {
      //保存
      const transferTask: ITask[] = Object.keys(values)
        .reduce((acc: ITask[], key: string) => {
          const tasks = Object.keys(values[key]).map(item => values[key][item].task)

          return [...acc, ...tasks]
        }, [])
        .flat()
      const courseTaskList: api.AddTaskParams['courseTaskList'] = transferTask
        .map(task => {
          // 如果是红包任务 有 taskExt
          const { rewardPercent, rewardSkin, pageId: _pageId, id: _id, coinAmount, ...rest } = task
          if (task.taskType === 'coinBank') {
            return {
              ...rest,
              words: '',
              taskExt: {
                rewardPercent,
                rewardSkin,
              },
            }
          } else if (task.groupName === 'starRainingGame' && task.taskType === 'startGame') {
            return {
              ...rest,
              words: '',
              taskExt: {
                ...(rest.taskExt || {}),
                coinAmount,
              },
            }
          }
          return {
            ...rest,
          }
        })
        .map((item, index) => {
          const { ...rest } = item
          return { ...rest, sortIndex: index + 1 }
        })
      const params = {
        slideId: slides.slideId,
        pageId,
        courseTaskList,
      }
        // 检验数据
      setLoading(true)
      await checkTaskData(params.courseTaskList, currentPage)
      await api.saveTask(params)
      dispatch.task.updateBtnEditable({ [pageId] : !editable })
    }).catch(err => {
      // message.error(err.message)
      if(err.errorFields) {
        const errMsg = err.errorFields.reduce((acc: string[], item: any) => {
          return [...acc, ...item.errors]
        },[])
        const errStr = [...new Set(errMsg)].join(',')
        if(errStr) message.error(errStr)
      }
      message.error(err.message)
      return Promise.reject(err)
    }).finally(() => {
      setLoading(false)
     
    })
  }, [currentPage, dispatch.task, form, getEditable, slides.slideId])
  return {
    loading,
    handleSubmit,
    getEditable: (pageId:string) => getEditable(pageId)
  }
}
