import { useCallback, useEffect, useMemo } from 'react'
import { Form } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, Dispatch } from '@/store'
import { ITask } from '@editor/typing'
import FormList from './component/FormList'
/**
 * 任务配置页面 任务组 组内不可调整 组之间可以调整顺序
 *
 */
const TaskBase = ({form}:{form:any}) => {
  const dispatch = useDispatch<Dispatch>()
  const { tasks } = useSelector((state: RootState) => state.task)
  const { currentPage, slides } = useSelector((state: RootState) => state.page)
  // const [form] = Form.useForm()
  // tasks 根据 groupType 分类  然后再根据 groupId 分类
  const currentTasks = useMemo(() => {
    return tasks.filter(item => item.pageId === currentPage.id)
  }, [currentPage.id, tasks])
  useEffect(() => {
    const result = currentTasks.reduce((acc, item) => {
      const groupId = item.groupId
      if (!acc[groupId]) {
        acc[groupId] = { task: [] }
      }
      acc[groupId].task.push(item)
      return acc
    }, {} as any)
    form.setFieldsValue({ tasks: Object.values(result) })
  }, [currentPage.id, form, currentTasks])
 
  useEffect(() => {
    if (slides.slideId) dispatch.task.getAllTaskList({ slideId: slides.slideId })
  }, [dispatch.task, slides.slideId])
const handleValuesChange = useCallback((changedValues:any, allValues:any) => {
  // 当前页面的tasks
  const newValues: ITask[] = allValues.tasks.reduce((acc: ITask[], item: any) => {
    return [...acc, ...item.task]
  },[])
  // newTasks 去更新 tasks
  const otherTasks = tasks.filter(item => item.pageId !== currentPage.id)
  const newTasks = [...otherTasks, ...newValues]
  //更新当前页面的tasks
  dispatch.task.updateData({ tasks: newTasks })
},[currentPage.id, dispatch.task, tasks])
  return (
    <>
      <Form
        size='small'
        form={form}
        layout='horizontal'
        onValuesChange={handleValuesChange}
      >
        <FormList form={form} />
      </Form>
    </>
  )
}

export default TaskBase
