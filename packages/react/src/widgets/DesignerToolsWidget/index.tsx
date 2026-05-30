import React, { Fragment, useRef } from 'react'
import { Button, InputNumber } from 'antd'
import { observer } from '@slides/reactive-react'
import { CursorType, ScreenType } from '@editor/core'
import {
  useCursor,
  useHistory,
  useScreen,
  usePrefix,
  useWorkbench,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import cls from 'classnames'
import './styles.less'

type DesignerToolsType = 'HISTORY' | 'CURSOR' | 'SCREEN_TYPE'

export type IDesignerToolsWidgetProps = {
  className?: string
  style?: React.CSSProperties
  use?: DesignerToolsType[]
}

export const DesignerToolsWidget: React.FC<IDesignerToolsWidgetProps> =
  observer((props) => {
    const screen = useScreen()
    const cursor = useCursor()
    const workbench = useWorkbench()
    const history = useHistory()
    const sizeRef = useRef<{ width?: any; height?: any }>({})
    const prefix = usePrefix('designer-tools')
    const renderHistoryController = () => {
      if (!props.use.includes('HISTORY')) return null
      return (
        <Button.Group size="small">
          <Button
            size="small"
            disabled={!history?.allowUndo}
            onClick={() => {
              history.undo()
            }}
          >
            <IconWidget infer="Undo" />
          </Button>
          <Button
            size="small"
            disabled={!history?.allowRedo}
            onClick={() => {
              history.redo()
            }}
          >
            <IconWidget infer="Redo" />
          </Button>
        </Button.Group>
      )
    }

    return (
      <div style={props.style} className={cls(prefix, props.className)}>
        {renderHistoryController()}
      </div>
    )
  })

DesignerToolsWidget.defaultProps = {
  use: ['HISTORY', 'CURSOR', 'SCREEN_TYPE'],
}
