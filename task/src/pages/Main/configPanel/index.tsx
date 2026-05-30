import { Tabs } from 'antd'
import TaskBase from './TaskPanel'
import { useTranslation } from 'react-i18next'
import Style from './styles.module.less'
import TaskAction from './TaskPanel/component/TaskAction'
import { GlobalContext } from '../GlobalContext'
import { useContext } from 'react'
const TaskSlide = () => {
  const { t } = useTranslation()
  const { form } = useContext(GlobalContext);
  const items = [
    // {
    //     label: t('config.content.panel.name'),
    //     key: '1',
    //     // children: <FormlistDemo />,
    //     children:<span>{t('config.content.panel.name')}</span>,
    // },
    {
      label: t('config.task.panel.name'),
      key: '2',
      children: <TaskBase form={form}/>,
    },
  ]

  return (
    <Tabs
      defaultActiveKey='2'
      className={Style['task-panel']}
      items={items}
      tabBarExtraContent={<TaskAction form={form}/>}
    ></Tabs>
  )
}

export default TaskSlide
