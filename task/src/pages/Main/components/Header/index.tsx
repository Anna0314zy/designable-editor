import { Button, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/store'
import {
	ITask,
	Status,
	Method,
	TaskForm,
	FollowUpLinkageType,
	GroupType,
  RewardSkin,
  taskTypes
} from "@editor/typing";
import { v4 as uuidv4 } from 'uuid'
import { useCallback, useMemo, memo } from 'react'
import { message } from 'antd'

function Header() {
  const dispatch = useDispatch<Dispatch>()
  const { minRewardPercent, maxRewardPercent, tasks } = useSelector((state: RootState) => state.task)
  const { currentPage } = useSelector((state: RootState) => state.page)
  const checkRewardPercent = useCallback(() => {
    const rewardTasks = tasks.filter((item: ITask) => item.groupName === 'coinBank')
    const total = rewardTasks.reduce((prev: number, cur: ITask) => {
      return prev + cur.rewardPercent!
    }, 0)
    if (total + minRewardPercent > maxRewardPercent) return Promise.reject(new Error('剩余红包配额不足'))
  }, [maxRewardPercent, minRewardPercent, tasks])
  //生成红包任务
  const handleAddReward = useCallback(() => {
    // 添加的时候 怎么让对应的dom 显示在 可视区域内

    const groupName: GroupType = 'coinBank'
    const base = {
      groupId: uuidv4(),
      groupName,
      pageId: currentPage.id,
      description: '发起红包给学生，倒计时结束，自动结束，也可手动结束',
      taskDurationSecond: 60,
      endMethod: Method.auto,
      skipStatus: Status.no,
      followUpLinkageType: FollowUpLinkageType.none,
      rewardSkin: RewardSkin.reward,
      rewardPercent: minRewardPercent,
      retryStatus: Status.no,
      countdownDisplay: Status.no,
    }
    const defaultData: ITask[] = taskTypes
      .filter(v => v.groupName === groupName)
      .map(item => {
        return {
          ...base,
          taskType: item.taskType,
          taskName: item.name,
          id: uuidv4(),
          taskForm: TaskForm.initiatedTask,
        }
      })
    return defaultData
  }, [currentPage.id, minRewardPercent])
  const handleAddPraiseBoard = useCallback(() => {
    const groupName: GroupType = 'praiseBoard'
    const base = {
      groupId: uuidv4(),
      groupName: groupName,
      pageId: currentPage.id,
      description: '全员表扬的环节，请表扬大家的积极表现',
      taskDurationSecond: 60,
      countdownDisplay: Status.no,
      endMethod: Method.manual,
      skipStatus: Status.no,
      retryStatus: Status.no,
      followUpLinkageType: FollowUpLinkageType.auto,
      words: '',
      taskForm: TaskForm.initiatedTask,
    }
    const defaultData: ITask[] = taskTypes
      .filter(v => v.groupName === groupName)
      .map((item, index) => {
        const obj = {
          ...base,
          taskType: item.taskType,
          taskName: `${item.name}`,
          id: uuidv4(),
        }
        switch (index) {
          case 1:
            obj.description = '冠军小组上台，让大家一起恭喜他们，给他们最高的荣耀'
            break
          case 2:
            obj.followUpLinkageType = FollowUpLinkageType.none
            obj.description =
              '各自小组上台，让他们鼓励自己，并且根据名次他们会获得相应的金币奖励。手动结束环节即会直接关闭环节，请注意'
            break
          default:
            break
        }
        return obj
      })
    return defaultData
  }, [currentPage.id])
  const handleNormalTask = useCallback(() => {
    const groupName: GroupType = 'normal'
    const base = {
      groupId: uuidv4(),
      groupName: groupName,
      pageId: currentPage.id,
      description: '提醒你在这一页做一些什么事情，任务时间为推荐时间，可随时手动结束',
      taskDurationSecond: 60,
      countdownDisplay: Status.no,
      endMethod: Method.auto,
      skipStatus: Status.no,
      retryStatus: Status.no,
      followUpLinkageType: FollowUpLinkageType.none,
      words: '',
      taskForm: TaskForm.promptTask,
    }
    const defaultData: ITask[] = taskTypes
      .filter(v => v.groupName === groupName)
      .map(item => {
        const obj = {
          ...base,
          taskType: item.taskType,
          taskName: item.name,
          id: uuidv4(),
        }
        return obj
      })
    return defaultData
  }, [currentPage.id])
  const onClick = useCallback(
    (type: GroupType) => {
      let defaultData: ITask[] = []
      if (type === "coinBank" && checkRewardPercent()) {
        message.config({
          top: 42,
          duration: 2,
          maxCount: 1,
          rtl: true,
        })
        message.info({
          content: '剩余红包配额不足',
          duration: 2,
        })
        return
      }
      switch (type) {
        case 'normal':
          defaultData = handleNormalTask()
          break
        case 'praiseBoard':
          defaultData = handleAddPraiseBoard()
          break
        case 'coinBank':
          defaultData = handleAddReward()
          break
        default:
          break
      }
      dispatch.task.addTasks({
        tasks: defaultData,
      })
      const pageId = currentPage.id
      dispatch.task.updateBtnEditable({ [pageId] : true })
      dispatch.task.updateData({ currentTaskId: defaultData[defaultData.length - 1].id })
    },
    [checkRewardPercent, currentPage.id, dispatch.task, handleAddPraiseBoard, handleAddReward, handleNormalTask],
  )
  //  生成任务入口

  const tasksConfig = useMemo(() => {
    return [
      {
        id: '1',
        name: '纯提示型任务',
        type: 'normal',
      },
      {
        id: '2',
        name: '表扬榜',
        type: 'praiseBoard',
      },
      {
        id: '3',
        name: '红包',
        type: 'coinBank',
      }
    ]
  }, [])

  return (
    <div className='header-container'>
      <div className='header-container-wrapper'>
        <Space>
          {tasksConfig.map(item => (
            <Button
              key={item.id}
              disabled={Boolean(!currentPage?.id)}
              onClick={() => onClick(item.type as GroupType)}
              size='small'
            >
              {item.name}
            </Button>
          ))}
        </Space>
      </div>
    </div>
  )
}
export default memo(Header)
