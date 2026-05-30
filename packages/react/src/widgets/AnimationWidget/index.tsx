/*
 * @Date: 2023-12-14 20:36:44
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-29 16:36:28
 * @FilePath: /slides-engine/packages/react/src/widgets/AnimationWidget/index.tsx
 */
import React from 'react'
import { usePrefix, useWorkbench, useSelectedNode, useTree, useDesigner } from '../../hooks'
import { observer } from '@slides/reactive-react'
import { SettingWidget } from './setting'
import { withErrorBoundary } from 'react-error-boundary'
import { RemoveNodeEvent, UnMakeGroupNodeEvent, MakeGroupNodeEvent } from '@editor/core'



export const AnimationWidget: React.FC = observer(() => {
    const workbench = useWorkbench()
    const current = workbench?.activeWorkspace || workbench?.currentWorkspace
    const currentWorkspaceId = current?.id
    const tree = useTree(currentWorkspaceId)
    const node = useSelectedNode(currentWorkspaceId)
    const childrenNodes = workbench.currentWorkspace?.operation.tree.serialize().children
    const page = node ? node.getRootNode() : tree

    const useRemoveNodeEffect = (engine) => {
        engine.subscribeTo(RemoveNodeEvent, (event) => {
            const { data } = event
            const { target } = data
            page.props.animates = (page.props.animates || []).filter(
                (ani) => ani.target !== target.id
            ).filter(Boolean) || []
        })
    }

    useDesigner((engine) => {
        useRemoveNodeEffect(engine)
    })
    return (
        <SettingWidget node={node} childrenNodes={childrenNodes} page={page} tree={tree} />
    )
})

export const AnimationWidgetWithErrorBoundary = withErrorBoundary(AnimationWidget, {
    FallbackComponent: ({ error, resetErrorBoundary }) => (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    ),
    onError: (error, info) => {
        console.log(error, info)
    }
})


