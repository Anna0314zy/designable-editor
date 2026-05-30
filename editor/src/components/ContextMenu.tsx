import React from 'react'
import { ContextMenuEvent, TreeNode } from '@editor/core'
import { useDesigner } from '@editor/react'
import { Modal } from 'antd'
import {
  MenuContextType,
  CommandId,
} from '../commands/CommandManager'
import { useCommandManager } from '../commands/CommandProvider'

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  type: MenuContextType
  targetNode?: TreeNode
}

const initialState: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  type: 'canvas',
}

export const ContextMenu: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const engine = useDesigner()
  const commandManager = useCommandManager()
  const [menu, setMenu] = React.useState<ContextMenuState>(initialState)

  React.useEffect(() => {
    const unsubscribe = engine.subscribeTo(ContextMenuEvent, (event) => {
      const target = event.data.target as HTMLElement
      const workspace =
        engine.workbench.activeWorkspace || engine.workbench.currentWorkspace
      const tree = workspace?.operation.tree
      const nodeElement = target?.closest?.(
        `*[${engine.props.nodeIdAttrName}]`
      )
      const nodeId = nodeElement?.getAttribute(engine.props.nodeIdAttrName)
      const targetNode = nodeId ? tree?.findById(nodeId) : tree
      const isElementMenu = Boolean(targetNode && targetNode !== tree)

      if (isElementMenu) {
        const selection = workspace.operation.selection
        if (!selection.has(targetNode)) {
          selection.safeSelect(targetNode)
        }
      }

      setMenu({
        visible: true,
        x: event.data.clientX,
        y: event.data.clientY,
        type: isElementMenu ? 'element' : 'canvas',
        targetNode,
      })
    })

    const close = () => {
      setMenu((state) => ({
        ...state,
        visible: false,
      }))
    }

    document.addEventListener('click', close)
    document.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)

    return () => {
      unsubscribe()
      document.removeEventListener('click', close)
      document.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [commandManager, engine])

  const commands = React.useMemo(() => {
    if (!menu.visible) return []
    return commandManager.getCommands(menu.type, menu.targetNode)
  }, [commandManager, menu])

  const runCommand = (id: CommandId) => {
    const execute = () => {
      commandManager.execute(id, menu.targetNode)
      setMenu((state) => ({
        ...state,
        visible: false,
      }))
    }

    if (id === 'ungroup') {
      Modal.confirm({
        title: '解组',
        content: '确定要解组吗？解组后编组相关动画会相应删除',
        okText: '确认',
        cancelText: '取消',
        onOk: execute,
      })
      return
    }

    execute()
  }

  return (
    <>
      {children}
      {menu.visible && commands.length > 0 && (
        <div
          style={{
            position: 'fixed',
            left: menu.x,
            top: menu.y,
            zIndex: 9999,
            minWidth: 144,
            padding: 4,
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            background: '#fff',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
          }}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          {commands.map((command) => {
            const disabled = !commandManager.canExecute(
              command.id,
              menu.targetNode
            )

            return (
              <button
                key={command.id}
                disabled={disabled}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 30,
                  padding: '0 10px',
                  border: 0,
                  borderRadius: 3,
                  background: 'transparent',
                  color: disabled ? '#bfbfbf' : '#262626',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => {
                  if (!disabled) runCommand(command.id)
                }}
              >
                {command.label}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
