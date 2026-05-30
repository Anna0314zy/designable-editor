import React, { useEffect, useRef, useState } from 'react'
import { observer } from '@slides/reactive-react'
import cls from 'classnames'
import {
  useDesigner,
  useGlobalData,
  usePrefix,
  useSetGlobalData,
} from '../hooks'
import { IconWidget, TextWidget } from '../widgets'
import { ResourceListWidget } from '../components/ResourceListWidget'
import {IWorkspace} from "@editor/core"
import ProgressList from '../components/ProgressList'
import CopyToClipboard from './CopyToClipboard'

export interface IStatusbarPanelProps {
  title?: React.ReactNode
  children?: React.ReactNode
  extra?: React.ReactNode,
  workspaceList: IWorkspace[]
}

export const StatusbarPanel: React.FC<IStatusbarPanelProps> = observer(
  (props) => {
    const {workspaceList} = props
    const prefix = usePrefix('footbar-panel')
    const [visible, setVisible] = useState(true)
    useEffect(() => {
      setVisible(true)
    }, [])
    const setGlobalData = useSetGlobalData()
    const globalData = useGlobalData()
    const fitScreen = () => {
      setGlobalData((preData) => {
        return { ...preData, viewportPercentage: null }
      })
    }
    const setNewViewportPercentage = (viewportPercentage, opt) => {
      let viewportPercentageInt = Math.floor(viewportPercentage * 100)
      if (viewportPercentageInt % 10 === 0) {
        if (opt === 'minus') {
          viewportPercentageInt -= 10
        }
        if (opt === 'plus') {
          viewportPercentageInt += 10
        }
      } else {
        if (opt === 'minus') {
          viewportPercentageInt = Math.floor(viewportPercentageInt / 10) * 10
        }
        if (opt === 'plus') {
          viewportPercentageInt = Math.ceil(viewportPercentageInt / 10) * 10
        }
      }
      let newViewportPercentage = viewportPercentageInt * 0.01
      // 对viewportPercentage进行限制，新的viewportPercentage不能小于30%，不能大于400%
      newViewportPercentage = Math.min(Math.max(newViewportPercentage, 0.3), 4)
      setGlobalData((preData) => {
        return { ...preData, viewportPercentage: newViewportPercentage }
      })
    }
    const engine = useDesigner()
    const workbench = engine.workbench
    const currentWorkspace = workbench.currentWorkspace
    // const workspaceList = workbench.workspaces
    // const total = workspaceList.length
    const index = workspaceList.findIndex(
      (item) => item.id === currentWorkspace.id
    )
    const parentRef = useRef(null)
    return (
      <div className={cls(prefix, { visible })}>
        <div className={prefix + '-left'}>
          <CopyToClipboard text={currentWorkspace.id}>
            <span>课件页:</span>
            </CopyToClipboard>
          {index + 1} / {workspaceList.length}
        </div>
        <div className={prefix + '-right'}>
          <div className={prefix + '-scale-container'} ref={parentRef}>
            <ProgressList  parentRef={parentRef} />
            <ResourceListWidget parentRef={parentRef} currentPageId={currentWorkspace.id}/>
            <IconWidget
              onClick={(e) => {
                setNewViewportPercentage(globalData.viewportPercentage, 'minus')
              }}
              tooltip={{
                title: <TextWidget>缩小</TextWidget>,
                placement: 'top',
              }}
              infer="Minus"
              style={{ cursor: 'pointer' }}
            />
            <div className={prefix + '-scale-current'}>
              {Math.floor(globalData.viewportPercentage * 100) + '%'}
            </div>
            <IconWidget
              onClick={(e) => {
                setNewViewportPercentage(globalData.viewportPercentage, 'plus')
              }}
              infer="Plus"
              tooltip={{
                title: <TextWidget>放大</TextWidget>,
                placement: 'top',
              }}
              style={{ cursor: 'pointer' }}
            />
            <IconWidget
              onClick={(e) => {
                fitScreen()
              }}
              tooltip={{
                title: <TextWidget>适应屏幕</TextWidget>,
                placement: 'top',
              }}
              infer="FullScreen"
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
        {props.children}
      </div>
    )
  }
)
