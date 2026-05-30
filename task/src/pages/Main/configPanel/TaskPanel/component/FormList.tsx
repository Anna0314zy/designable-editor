import { Form, Space } from 'antd'
import { useCallback,useMemo,memo } from 'react'
import { MinusCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { ITask } from '@editor/typing'
import TaskItem from './TaskItem'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import UseScrollIntoView from './UseScrollIntoView'
import cls from 'classnames'

const FormList = ({ form }: any) => {
  const { schema, btnEditable:formEditable } = useSelector((state: RootState) => state.task)
  const { currentPage } = useSelector((state: RootState) => state.page)
  const btnEditable = useMemo(() => formEditable[currentPage.id as string], [currentPage.id, formEditable])
  UseScrollIntoView()
  const getSchema = useCallback(
    (name: number, data: ITask) => {
      return schema.find(item => item.findIndex(itm => itm.id === data.id) > -1) || []
    },
    [schema],
  )
  const handleUp = useCallback((move: (arg0: any, arg1: number) => void,index: number) => {
    if (!btnEditable) return
    move(index, index - 1)
    const tasks = form.getFieldValue('tasks')
    form.setFieldsValue({ tasks: tasks })
  },[btnEditable, form])
  const handleDown = useCallback((move: (arg0: any, arg1: number) => void,index: number) => {
    if (!btnEditable) return
    move(index, index + 1)
    const tasks = form.getFieldValue('tasks')
    form.setFieldsValue({ tasks: tasks })
  },[btnEditable, form])
  const handleRemove = useCallback((remove: (arg0: any) => void,field: any) => {
    if (!btnEditable) return
    remove(field.name)
    // 删除任务
    const tasks = form.getFieldValue('tasks')
    form.setFieldsValue({ tasks: tasks })
    form.validateFields()
  },[btnEditable, form])
  return (
    <Form.List name='tasks'>
      {(fields, { remove, move }) => (
        <>
          {fields.map((field, index) => {
            const tasks = form.getFieldValue('tasks')[field.name].task
            return (
              <div key={field.key + 'tasks'} className='formList-wrapper'>
                <Space style={{ display: 'flex', justifyContent: 'flex-end',float:'right' }}>
                  {tasks?.length > 0 && !tasks[0].elementId && (
                    <MinusCircleOutlined
                      className={cls('remove-icon', { disabled: !btnEditable })}
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                      onClick={() => handleRemove(remove,field)}
                    />
                  )}
                  {index !== 0 && (
                    <ArrowUpOutlined
                      className={cls({ disabled: !btnEditable })}
                      onClick={() => handleUp(move,index)}
                    />
                  )}
                  {index !== fields.length - 1 && (
                    <ArrowDownOutlined
                      className={cls({ disabled: !btnEditable })}
                      onClick={() =>handleDown(move,index)}
                    />
                  )}
                </Space>

                <Form.List {...field} name={[field.name, 'task']}>
                  {childFieldList => (
                    <>
                      {childFieldList.map((childField) => {
                        // 渲染formItem 时，需要注意，name的值，是一个数组，数组的第一项是当前的field.name，第二项是当前的childField.name
                        const data = form.getFieldValue('tasks')?.[field.name]?.task?.[childField.name]
                        return (
                          <div
                            className={cls('taskGroup',{first:childField.name === 0})}
                            key={`${field.key}-${childField.key}`}
                            id={form.getFieldValue('tasks')?.[field.name]?.task?.[childField.name]?.id}
                          >
                            {getSchema(childField.name, data).map(item => (
                              <TaskItem
                               taskIndex={index}
                                key={data.id + item.taskType}
                                config={item}
                                filed={childField}
                                data={data}
                                form={form}
                                parentField={field}
                              />
                            ))}
                          </div>
                        )
                      })}
                    </>
                  )}
                </Form.List>
                {/* {index !== fields.length - 1 && <Divider type='horizontal' />} */}
              </div>
            )
          })}
        </>
      )}
    </Form.List>
  )
}

export default memo(FormList)
