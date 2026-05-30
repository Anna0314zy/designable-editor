export * from './auth'
import { PageType } from '@/store/models/page'
import { Page } from '@/store/models/page'
import { SaveParams } from '@/api/models/task'
export const checkTaskData = (courseTaskList:SaveParams['courseTaskList'], currentPage: Page) => {
    return new Promise((resolve, reject) => {
      const pageType = currentPage.pageType
      if (pageType === PageType.gamePage) {
        if(currentPage.children.length === 0) resolve('')
        // 如果当前任务时游戏 必须要有根据内容生成的任务
        const tasks = courseTaskList.filter(item => item.elementId)
        if (tasks.length === 0) {
          const msg = '当前游戏页未成功生成游戏任务,请先编辑课件生成对应的任务'
          reject(new Error(msg))
        } else {
          resolve('')
        }
      } else {
        resolve('')
      }
    })
  }