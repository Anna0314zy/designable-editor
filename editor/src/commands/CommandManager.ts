import {
  Engine,
  MakeGroupNodeEvent,
  TreeNode,
  UnMakeGroupNodeEvent,
  Workspace,
} from '@editor/core'
import { groupRect } from '@editor/react/src/containers/MoveableContainer'

export type CommandId =
  | 'copy'
  | 'paste'
  | 'delete'
  | 'selectAll'
  | 'group'
  | 'ungroup'
  | 'page.addSection'
  | 'page.addSlide'
  | 'page.copy'
  | 'page.delete'
  | 'section.delete'
  | 'section.rename'
  | 'pages.copySelected'
  | 'pages.deleteSelected'

export type MenuContextType = 'canvas' | 'element' | 'page' | 'section' | 'pages'

export interface CommandContext {
  engine: Engine
  workspace?: Workspace
  tree?: TreeNode
  selectedNodes: TreeNode[]
  targetNode?: TreeNode
  payload?: any
}

export interface CommandItem {
  id: CommandId
  label: string
  shortcuts?: string[]
  menuTypes?: MenuContextType[]
  enabled?: (ctx: CommandContext) => boolean
  visible?: (ctx: CommandContext, menuType?: MenuContextType) => boolean
  execute: (ctx: CommandContext) => void
}

const CLONE_OFFSET = {
  x: 10,
  y: 10,
}

const translateRegExp =
  /translate\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)/

const rotateRegExp = /rotate\(\s*(-?\d+(?:\.\d+)?)deg\s*\)/

const parseTransform = (transform = '') => {
  const translate = transform.match(translateRegExp)
  const rotate = transform.match(rotateRegExp)

  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate ? Number(translate[2]) : 0,
    rotate: rotate ? Number(rotate[1]) : 0,
  }
}

const createTransform = (x: number, y: number, rotate = 0) => {
  return `translate(${x}px, ${y}px) rotate(${rotate}deg)`
}

const getNodeRect = (node: TreeNode) => {
  const style = node.props?.style || {}
  const { x, y } = parseTransform(style.transform)

  return {
    left: x,
    top: y,
    right: x + parseFloat(style.width || 0),
    bottom: y + parseFloat(style.height || 0),
  }
}

const getSelectedRect = (nodes: TreeNode[]) => {
  const rects = nodes.map(getNodeRect)
  const left = Math.min(...rects.map((rect) => rect.left))
  const top = Math.min(...rects.map((rect) => rect.top))
  const right = Math.max(...rects.map((rect) => rect.right))
  const bottom = Math.max(...rects.map((rect) => rect.bottom))

  return {
    left,
    top,
    offsetWidth: right - left,
    offsetHeight: bottom - top,
    rotation: 0,
  }
}

export class CommandManager {
  private engine: Engine
  private commands = new Map<CommandId, CommandItem>()
  private clipboardNodes: TreeNode[] = []
  private getViewportPercentage: () => number

  constructor(
    engine: Engine,
    options: {
      getViewportPercentage?: () => number
    } = {}
  ) {
    this.engine = engine
    this.getViewportPercentage = options.getViewportPercentage || (() => 1)
    this.registerDefaults()
  }

  register(command: CommandItem) {
    this.commands.set(command.id, command)
  }

  unregister(id: CommandId) {
    this.commands.delete(id)
  }

  getCommand(id: CommandId) {
    return this.commands.get(id)
  }

  getCommands(menuType?: MenuContextType, targetNode?: TreeNode, payload?: any) {
    const ctx = this.getContext(targetNode, payload)

    return Array.from(this.commands.values()).filter((command) => {
      const matchMenuType =
        !menuType || !command.menuTypes || command.menuTypes.includes(menuType)
      const visible = command.visible ? command.visible(ctx, menuType) : true
      return matchMenuType && visible
    })
  }

  canExecute(id: CommandId, targetNode?: TreeNode, payload?: any) {
    const command = this.getCommand(id)
    if (!command) return false
    const ctx = this.getContext(targetNode, payload)
    return command.enabled ? command.enabled(ctx) : true
  }

  execute(id: CommandId, targetNode?: TreeNode, payload?: any) {
    const command = this.getCommand(id)
    if (!command) return

    const ctx = this.getContext(targetNode, payload)
    if (command.enabled && !command.enabled(ctx)) return

    command.execute(ctx)
  }

  getContext(targetNode?: TreeNode, payload?: any): CommandContext {
    const workspace =
      this.engine.workbench.activeWorkspace ||
      this.engine.workbench.currentWorkspace
    const tree = workspace?.operation.tree

    return {
      engine: this.engine,
      workspace,
      tree,
      selectedNodes: workspace?.operation.selection.selectedNodes || [],
      targetNode,
      payload,
    }
  }

  private registerDefaults() {
    this.register({
      id: 'copy',
      label: '复制',
      shortcuts: ['ctrl+c', 'command+c'],
      menuTypes: ['element'],
      enabled: (ctx) => ctx.selectedNodes.length > 0,
      execute: (ctx) => {
        this.clipboardNodes = ctx.selectedNodes.filter((node) => {
          return node && node !== node.root && node.allowClone()
        })
      },
    })

    this.register({
      id: 'paste',
      label: '粘贴',
      shortcuts: ['ctrl+v', 'command+v'],
      menuTypes: ['canvas', 'element'],
      enabled: () => this.clipboardNodes.length > 0,
      execute: () => {
        TreeNode.clone(this.clipboardNodes, {
          offset: CLONE_OFFSET,
          selectCloned: true,
        })
      },
    })

    this.register({
      id: 'selectAll',
      label: '全选',
      shortcuts: ['ctrl+a', 'command+a'],
      menuTypes: ['canvas'],
      execute: (ctx) => {
        ctx.tree?.operation.selection.batchSelect(ctx.tree.descendants)
      },
    })

    this.register({
      id: 'delete',
      label: '删除',
      shortcuts: ['backspace', 'delete'],
      menuTypes: ['element'],
      enabled: (ctx) => ctx.selectedNodes.length > 0,
      execute: (ctx) => {
        TreeNode.remove(ctx.selectedNodes)
      },
    })

    this.register({
      id: 'group',
      label: '编组',
      menuTypes: ['element'],
      enabled: (ctx) => this.canGroup(ctx.selectedNodes),
      visible: (ctx) => this.canGroup(ctx.selectedNodes),
      execute: (ctx) => {
        this.group(ctx)
      },
    })

    this.register({
      id: 'ungroup',
      label: '解组',
      menuTypes: ['element'],
      enabled: (ctx) => this.canUngroup(ctx.selectedNodes),
      visible: (ctx) => this.canUngroup(ctx.selectedNodes),
      execute: (ctx) => {
        this.ungroup(ctx)
      },
    })
  }

  private canGroup(selectedNodes: TreeNode[]) {
    return (
      selectedNodes.length > 1 &&
      selectedNodes.every((node) => {
        return node && node.componentName !== 'Group' && node.depth === 1
      })
    )
  }

  private canUngroup(selectedNodes: TreeNode[]) {
    if (!selectedNodes.length) return false
    const parent = selectedNodes[0].parent
    return Boolean(
      parent &&
      parent.componentName === 'Group' &&
      selectedNodes.every((node) => node.parent === parent)
    )
  }

  private group(ctx: CommandContext) {
    const { workspace, tree, selectedNodes } = ctx
    if (!workspace || !tree) return
    const sourceNodes = [this.engine.findNodeById('mark_group_source_id')]

    if (!tree?.allowAppend(sourceNodes)) return

    const newTreeNode = tree.append(
      ...TreeNode.filterDroppable(sourceNodes, tree)
    )[0]

    if (newTreeNode.allowAppend(selectedNodes)) {
      newTreeNode.append(...selectedNodes)
    }

    workspace.operation.dispatch(
      new MakeGroupNodeEvent({
        target: newTreeNode,
        source: selectedNodes,
      })
    )

    const viewportPercentage = this.getViewportPercentage()
    const rect = groupRect || getSelectedRect(selectedNodes)
    const left = rect.left / viewportPercentage
    const top = rect.top / viewportPercentage
    const rotation = rect.rotation || 0

    newTreeNode.setProps({
      style: {
        width: `${rect.offsetWidth / viewportPercentage}px`,
        height: `${rect.offsetHeight / viewportPercentage}px`,
        transform: createTransform(left, top, rotation),
      },
    })

    selectedNodes.forEach((node) => {
      const transform = parseTransform(node.props?.style?.transform)
      node.setProps({
        style: {
          ...node.props.style,
          transform: createTransform(
            transform.x - left,
            transform.y - top,
            transform.rotate - rotation
          ),
        },
      })
    })

    workspace.operation.selection.batchSafeSelect(selectedNodes)
  }

  private ungroup(ctx: CommandContext) {
    const { workspace, tree, selectedNodes } = ctx
    if (!workspace || !tree) return
    const parent = selectedNodes[0]?.parent

    if (!parent || parent.componentName !== 'Group') return

    let animateList = [...(tree.props.animates || [])]
    animateList = animateList.filter((ani) => {
      return ani.target !== parent.id && ani.triggerSource !== parent.id
    })
    tree.setProps({
      animates: animateList,
    })

    if (!tree.allowAppend(selectedNodes)) return

    const childNodes = parent.children
    const parentTransform = parseTransform(parent.props?.style?.transform)

    tree.append(...childNodes)
    parent.remove()

    workspace.operation.dispatch(
      new UnMakeGroupNodeEvent({
        target: parent,
        source: selectedNodes,
      })
    )

    selectedNodes.forEach((node) => {
      const transform = parseTransform(node.props?.style?.transform)
      node.setProps({
        style: {
          ...node.props.style,
          transform: createTransform(
            transform.x + parentTransform.x,
            transform.y + parentTransform.y,
            transform.rotate + parentTransform.rotate
          ),
        },
      })
    })

    workspace.operation.selection.batchSafeSelect([parent.getRootNode()])
  }
}
