import React, { Fragment, useEffect } from 'react'
import { useTree, usePrefix, useDesigner, useComponents, useWorkspace } from '../../hooks'
import { TreeNodeContext, DesignerComponentsContext } from '../../context'
import { IDesignerComponents } from '../../types'
import { TreeNode, GlobalRegistry } from '@editor/core'
import { defaultComposer } from '@editor/shared'

import { observer } from '@slides/reactive-react'
import cls from 'classnames'
import './styles.less'
import { moveable_class } from '../../containers'
import { PageType } from '../AddPageWidget'
import { useResourceData } from '../../hooks'

export interface IComponentTreeWidgetProps {
  style?: React.CSSProperties
  className?: string
  components: IDesignerComponents
}

export interface ICustomComponentTreeWidgetProps {
  style?: React.CSSProperties
  className?: string
  components: IDesignerComponents
  workspaceId: string
  resourceHost?: string
}

export interface ITreeNodeWidgetProps {
  node: TreeNode
  children?: React.ReactChild
}


export const TreeNodeWidget: React.FC<ITreeNodeWidgetProps> = observer(
  (props: ITreeNodeWidgetProps) => {
    const designer = useDesigner(props.node?.designerProps?.effects)
    const components = useComponents()
    const node = props.node
    const renderChildren = () => {
      if (node?.designerProps?.selfRenderChildren) return []
      return node?.children?.map((child) => {
        return <TreeNodeWidget key={child.id} node={child} />
      })
    }

    const renderProps = (extendsProps: any = {}) => {
      // 点击时增加的的 style 赋值，顶掉了 defaultProps 里的 style
      const props = defaultComposer(node.designerProps?.defaultProps || {}, node.designerProps?.getComponentProps?.(node) || {},node.props, {
        treeNodeProps: extendsProps
      })

      if (node.depth === 0) {
        delete props.style
      }
      return props
    }
    const renderComponent = () => {
      const componentName = node.componentName
      const Component = components[componentName]
      const dataId = {} as Record<string, string>;

      if (Component) {
        if (designer) {
          dataId[designer?.props?.nodeIdAttrName] = node.id;
          dataId.className = moveable_class;
        }
        return React.createElement(
          Component,
          renderProps(dataId),
          renderChildren()
        )
      } else {
        if (node?.children?.length) {
          return <Fragment>{renderChildren()}</Fragment>
        }
      }
    }

    if (!node) return null
    if (node.hidden) return null
    return React.createElement(
      TreeNodeContext.Provider,
      { value: node },
      renderComponent()
    )
  }
)

export const ComponentTreeWidget: React.FC<IComponentTreeWidgetProps> =
  observer((props: IComponentTreeWidgetProps) => {
    const tree = useTree()
    const prefix = usePrefix('component-tree')
    const designer = useDesigner()
    const dataId = {}
    if (designer && tree) {
      dataId[designer?.props?.nodeIdAttrName] = tree.id
    }
    useEffect(() => {
      GlobalRegistry.registerDesignerBehaviors(props.components)
    }, [])
    return (
      <div
        style={{ ...props.style, ...tree?.props?.style }}
        className={cls(prefix, props.className)}
        {...dataId}
      >
        <DesignerComponentsContext.Provider value={props.components}>
          <TreeNodeWidget node={tree} />
        </DesignerComponentsContext.Provider>
      </div>
    )
  })

ComponentTreeWidget.displayName = 'ComponentTreeWidget'

export const CustomComponentTreeWidget: React.FC<ICustomComponentTreeWidgetProps> =
  observer((props: ICustomComponentTreeWidgetProps) => {
    const resourceData = useResourceData()
    const workspaceId = props.workspaceId
    const workspace = useWorkspace(workspaceId)
    const isGamePage = Number(workspace.pageType) === Number(PageType.gamePage)
    const tree = workspace?.operation.tree
    const prefix = usePrefix('component-tree')
    const designer = useDesigner()
    const dataId = {}
    if (designer && tree) {
      dataId[designer?.props?.nodeIdAttrName] = tree.id
    }
    let firstChild = null
    if(tree?.children.length > 0) {
      firstChild = tree?.children[0]
    }

    const transUrl = (md5: string) => {
      const path = resourceData.find((item) => item.fileMd5 === md5)?.cosFullPath
      const host = props.resourceHost
      return path ? host + path : ''
    }

    const style = { width:'1280px', height:'960px', backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center center',...props.style, ...tree?.props?.style, backgroundImage:tree?.props?.style?.backgroundImage ? `url(${transUrl(tree?.props?.style?.backgroundImage)})` : '' }

    return (
      <div
        style={style}
        className={cls(prefix, props.className)}
        {...dataId}
      >
        {
          isGamePage ? (
            firstChild?
            <div className="game-pic" style={{position:'absolute', top:0, left: 0, width:1280, height:960, background: `url(${firstChild.props.cover}) center/contain no-repeat`}}>
            </div>:<></>
          ) :(<div className='normal-page' style={{pointerEvents:"none"}}>
            <DesignerComponentsContext.Provider value={props.components}>
              <TreeNodeWidget node={tree} />
            </DesignerComponentsContext.Provider>
          </div>)
        }
      </div>
    )
  })