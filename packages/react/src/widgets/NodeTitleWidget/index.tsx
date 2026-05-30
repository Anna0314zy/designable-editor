/*
 * @Date: 2023-12-05 17:50:08
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-18 16:43:14
 * @FilePath: /slides-engine/packages/react/src/widgets/NodeTitleWidget/index.tsx
 */
import React, { Fragment } from 'react'
import { observer } from '@slides/reactive-react'
import { TreeNode } from '@editor/core'
export interface INodeTitleWidgetProps {
  node: TreeNode
}

export const NodeTitleWidget: React.FC<INodeTitleWidgetProps> = observer(
  (props) => {
    const takeNode = () => {
      const node = props.node
      if (node.componentName === '$$ResourceNode$$') {
        return node.children[0]
      }
      return node
    }
    const node = takeNode()
    return <Fragment>{node.props.info?.name || node.getMessage('title') || node.componentName}</Fragment>
  }
)
