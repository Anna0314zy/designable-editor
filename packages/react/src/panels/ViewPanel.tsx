/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-02 17:11:46
 * @FilePath: /slides-engine/packages/react/src/panels/ViewPanel.tsx
 */
import React, { useEffect, useState } from 'react'
import { TreeNode, ITreeNode, WorkbenchTypes } from '@editor/core'
import { observer } from '@slides/reactive-react'
import { useTree, useWorkbench } from '../hooks'
import { Viewport } from '../containers'
import { requestIdle } from '@editor/shared'
import { useResourceData } from '../hooks'

export interface IViewPanelProps {
  type: WorkbenchTypes
  children: React.ReactElement
  scrollable?: boolean
  dragTipsDirection?: 'left' | 'right',
  extra?: React.ReactElement,
  resourceHost?: string
}

export const ViewPanel: React.FC<IViewPanelProps> = observer((props) => {
  const [visible, setVisible] = useState(true)
  const workbench = useWorkbench()
  const tree = useTree()
  useEffect(() => {
    if (workbench.type === props.type) {
      requestIdle(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
    }
  }, [workbench.type])
  if (workbench.type !== props.type) return null
  if(tree.props.style) {
    tree.props.style.backgroundColor;
    tree.props.style.borderWidth
    tree.props.style.borderStyle
    tree.props.style.borderColor
  }

  if (workbench.type === 'DESIGNABLE') {
    const mergeStyle = {
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      ...tree.props.style,
    }
    const resourceData = useResourceData()
    if(tree.props.style && tree.props.style.backgroundImage) {
      const url = resourceData.find((item) => item.fileMd5 === tree.props.style.backgroundImage)?.cosFullPath
      url && (mergeStyle.backgroundImage = `url(${props.resourceHost}${url})`)
    }
    return (
      <Viewport dragTipsDirection={props.dragTipsDirection} viewportalstyle={{...mergeStyle}} extra={props.extra}>
        {props.children}
      </Viewport>
    )
  }
  return (
    <div
      style={{
        overflow: props.scrollable ? 'overlay' : 'hidden',
        height: '100%',
        cursor: 'auto',
        userSelect: 'text',
      }}
    >
      {visible && props.children}
    </div>
  )
})

ViewPanel.defaultProps = {
  scrollable: true,
}
