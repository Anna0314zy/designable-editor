import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 导入插件
import 'dayjs/locale/zh-cn' // 导入本地化语言
import { observer } from '@slides/reactive-react'
import { usePrefix, useWorkbench } from '../../hooks'
import { TextWidget } from '../TextWidget'
import cls from 'classnames'
import './styles.less'

dayjs.extend(relativeTime) // 使用插件
dayjs.locale('zh-cn') // 使用本地化语言

export const HistoryWidget: React.FC = observer(() => {
  const workbench = useWorkbench()
  const currentWorkspace =
    workbench?.activeWorkspace || workbench?.currentWorkspace
  const prefix = usePrefix('history')
  if (!currentWorkspace) return null
  return (
    <div className={prefix}>
      {[...currentWorkspace.history.list()].reverse().map((item, index) => {
        const type = item.type || 'default_state'
        const token = type.replace(/\:/g, '_')
        return (
          <div
            className={cls(prefix + '-item', {
              active: currentWorkspace.history.current === index,
            })}
            key={item.timestamp}
            onClick={() => {
              currentWorkspace.history.goTo(index)
            }}
          >
            <span className={prefix + '-item-title'}>
              <TextWidget token={`operations.${token}`} />
            </span>
            <span className={prefix + '-item-timestamp'}>
              {' '}
              {dayjs(item.timestamp).toNow()}
            </span>
          </div>
        )
      })}
    </div>
  )
})
