import { Form, Input, Radio, InputNumber, Slider } from 'antd'
import { IConfigData } from '@/store/models/types/tasks'
import { ITask } from '@editor/typing'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/store'
import { useCallback, useMemo, useState, memo } from 'react'
import WordsContent from '@/pages/Main/components/Header/WordsContent'
import cls from 'classnames'
interface ITaskItemProps {
  config: IConfigData
  filed: any
  data: ITask
  form: any
  parentField: any
  taskIndex:number
}
function TaskItem({ config, filed, data, form,taskIndex }: ITaskItemProps) {
  const dispatch = useDispatch<Dispatch>()
  const { btnEditable : formEditable } = useSelector((state: RootState) => state.task)
  const [value, setValue] = useState(data[config.taskType] as number)
  const btnEditable = useMemo(() => formEditable[data.pageId as string], [data.pageId, formEditable])
  // 根据不同的类型渲染不同的组件
  // 如果当前不可编辑，只显示当前的值
  const options = useMemo(() => {
    if (config?.editable === false) {
      return config.options?.filter((i: any) => i.value === data[config.taskType])
    }
    return config?.options
  }, [config?.editable, config.taskType, config.options, data])
  // 增加台词如何实现
  // console.log('%c dataTaskItem 渲染 ', 'color:red')
  const onChange = useCallback(
    (newValue: number) => {
      setValue(newValue)
      dispatch.task.updateTaskById({
        id: data.id,
        [config.taskType]: newValue,
      })
      setTimeout(() => {
        form.validateFields()
      })
    },
    [config.taskType, data.id, dispatch.task, form],
  )
  const Content = ({ config }: { config: IConfigData }) => {
    if (!btnEditable || config?.editable === false) {
      if (config.type === 'radio') {
        const value = config.options?.find(item => item.value === data[config.taskType])
        return <span>{value?.name}</span>
      }
      return (
        <span>
          {config?.formatter?.(value as number) || (
            <div>
              <span> {data[config.taskType]}</span>
              <span> {config?.props?.suffix}</span>
            </div>
          )}
        </span>
      )
    }
    switch (config.type) {
      case 'input':
        return <Input {...config.props} disabled={!btnEditable} />

      case 'textarea':
        return <Input.TextArea {...config.props} />
      case 'inputNumber':
        return <InputNumber {...config.props} controls={false} disabled={!btnEditable} />
      case 'radio':
        return (
          <Radio.Group>
            {options?.map(option => {
              // 最后一个需要判断当前按钮是否可以选择
              return (
                <Radio disabled={!btnEditable} value={option.value} key={option.value}>
                  {option.name}
                </Radio>
              )
            })}
          </Radio.Group>
        )
      case 'slider':
        return (
          <div style={{ display: 'flex' }}>
            <Slider
              disabled={!btnEditable}
              value={value}
              style={{ flex: 1, marginRight: '10px' }}
              {...config.props}
              onChange={onChange}
            ></Slider>
            <span style={{ alignSelf: 'center' }}>{config?.formatter?.(value as number)}</span>
          </div>
        )
      case 'void': {
        if (config.taskType === 'words' && data[config.taskType])
          return <Input {...config.props} disabled={!btnEditable} />
        return <WordsContent data={data} />
      }
      case 'text':
        return (
          <span>
            {data[config.taskType]}
            {config?.props?.suffix}
          </span>
        )
      default:
        return null
    }
  }
  const getLabel = useMemo(() => {
    if (config.taskType === 'taskName') return `${config.name}${taskIndex+1}`
    return config.name
  }, [config.name, config.taskType, taskIndex])
  return (
    <Form.Item
      label={getLabel}
      name={[filed.name, config.taskType]}
      key={config.taskType}
      rules={config.rules}
      className={cls({
        textarea: config.type === 'textarea' && btnEditable,
        'no-label': config.type === 'void' && btnEditable && !data[config.taskType],
      })}
    >
      {/* 台词编辑的时候 没有台词 可以显示 ＋号 非编辑态 需要显示台词 */}
      {Content({ config })}
    </Form.Item>
  )
}
export default memo(TaskItem)
