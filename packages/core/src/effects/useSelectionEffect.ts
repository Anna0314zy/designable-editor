import { Engine, CursorStatus, TreeNode } from '../models'
import { MouseClickEvent } from '../events'
import { KeyCode, Point } from '@editor/shared'

/**
 * @description 选中元素
 * @param engine 
 */
export const useSelectionEffect = (engine: Engine) => {
  engine.subscribeTo(MouseClickEvent, (event) => {

    // 必须是光标状态为正常状态才能选中
    if (engine.cursor.status !== CursorStatus.Normal) {
      return
    } 

    // debugger
    const target: HTMLElement = event.data.target as any
    const el = target?.closest?.(`
      *[${engine.props.nodeIdAttrName}],
      *[${engine.props.outlineNodeIdAttrName}]
    `)
    const isHelpers = target?.closest?.(
      `*[${engine.props.nodeSelectionIdAttrName}]`
    )
    const currentWorkspace =
      event.context?.workspace ?? engine.workbench.activeWorkspace
    if (!currentWorkspace) return
    // el?.getAttribute 用来判断是否是节点，只有节点元素才有这个方法，很取巧
    if (!el?.getAttribute) {
      const point = new Point(event.data.topClientX, event.data.topClientY)
      const operation = currentWorkspace.operation
      const viewport = currentWorkspace.viewport
      const outline = currentWorkspace.outline
      const isInViewport = viewport.isPointInViewport(point, false)
      const isInOutline = outline.isPointInViewport(point, false)
      if (isHelpers) return
      if (isInViewport || isInOutline) {
        const selection = operation.selection
        const tree = operation.tree
        selection.select(tree)
      }
      return
    }
    const nodeId = el.getAttribute(engine.props.nodeIdAttrName)
    const structNodeId = el.getAttribute(engine.props.outlineNodeIdAttrName)

    const operation = currentWorkspace.operation
    const selection = operation.selection
    const tree = operation.tree
    const node = tree.findById(nodeId || structNodeId)
    // 这一块逻辑需要盘一下，多个选取如何处理，目前看逻辑不支持
    // 多个元素属性的设置需要看下，这一块我看是有问题的
    if (node) {
      // 清除按键状态
      // engine.keyboard.requestClean()
      if (
        engine.keyboard.isKeyDown(KeyCode.Meta) ||
        engine.keyboard.isKeyDown(KeyCode.Control)
      ) {
        // 如果当前选择器中包含这个元素
        if (selection.has(node)) {
          // 如果当前选择器中的元素大于1个
          if (selection.selected.length > 1) {
            // 则去反选这个元素
            selection.remove(node)
          }
        } else {
          // 否则就直接选中这个元素
          selection.add(node)
        }
      } else if (engine.keyboard.isKeyDown(KeyCode.Shift)) { // 如果是按下了shift键
        return // 废弃shift键的功能
        // 如果当前选择器中包含这个元素
        if (selection.has(node)) {
          // 如果当前选择器中的元素大于1个
          if (selection.selected.length > 1) {
            // 则去反选这个元素
            selection.remove(node)
          }
        } else {
          // 否则就直接选中多个元素
          selection.crossAddTo(node)
        }
      } else {
        selection.select(node)
      }
    } else {
      selection.select(tree)
    }
  })
}
