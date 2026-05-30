import { Engine, CursorStatus, TreeNode } from '../models'
import { MouseClickEvent, PointerDownEvent, DownSelectEvent } from '../events'

export const usePositionEffect = (engine: Engine) => {
  engine.subscribeTo(MouseClickEvent, (event) => {
    if (engine.cursor.status !== CursorStatus.Normal) {
      return
    }

    // debugger
    const target: HTMLElement = event.data.target as any
    const sourceEl = target?.closest?.(`*[${engine.props.sourceIdAttrName}]`) as unknown as HTMLElement

    const visibleContainer = target?.closest?.(`*[${engine.props.visibleContainerIdAttrName}]`)

    // 大纲树节点
    const outlineEl = target?.closest?.(`*[${engine.props.outlineNodeIdAttrName}]`)


    // 非 onClickAll 事件放过的事件类型
    // 画布中的节点
    const nodeEl = target?.closest?.(`*[${engine.props.nodeIdAttrName}]`)

    const currentWorkspace =
      event.context?.workspace ?? engine.workbench.activeWorkspace
    if (!currentWorkspace) return

    // 点击大纲树节点，选中画布中的节点
    if (outlineEl) {
      const operation = currentWorkspace.operation
      const selection = operation.selection
      const tree = operation.tree
      const node = tree.findById(outlineEl.getAttribute(engine.props.outlineNodeIdAttrName))
      if (node) {
        selection.safeSelect(node)
      }
    }

    // 如果只是点击画布+视口区域，选中根节点
    if (!nodeEl?.getAttribute) {
      const operation = currentWorkspace.operation
      const selection = operation.selection
      if (selection.selectedNodes.length === 0) {
        selection.safeSelect(operation.tree)
      }
    }

    if (!sourceEl && !visibleContainer) {
      return
    }

    const sourceId = sourceEl?.getAttribute(engine.props.sourceIdAttrName)

    // 点击源节点添加到画布中去
    if (sourceId) {
      Array.from(event.data.view.document.querySelectorAll(`*[${engine.props.sourceIdAttrName}]`)).forEach((item) => {
        (item as HTMLElement).dataset.chose = '0'
      });
      const origChose = sourceId ? (sourceEl.dataset.chose || '0') : '0';
      sourceEl.dataset.chose = 1 - Number(origChose) + ''
    } else if (visibleContainer) {
      const choseSourceEl = event.data.view.document.querySelector(`*[${engine.props.sourceIdAttrName}][data-chose="1"]`) as HTMLElement;

      Array.from(event.data.view.document.querySelectorAll(`*[${engine.props.sourceIdAttrName}]`)).forEach(item => {
        (item as HTMLElement).dataset.chose = '0'
      });

      if (choseSourceEl) {
        const sourceId = choseSourceEl?.getAttribute(engine.props.sourceIdAttrName)
        const sourceNodes = [engine.findNodeById(sourceId)]
        const closestNode = currentWorkspace.operation.tree

        if (closestNode.allowAppend(sourceNodes)) {
          const newTreeNode = closestNode.append(...TreeNode.filterDroppable(sourceNodes, closestNode))
          const rootEle = event.context.viewport.findElementById(closestNode.id)
          const scale = event.context.viewport.scale;
          const { x: rootX, y: rootY } = rootEle.getBoundingClientRect();
          const x = (event.data.clientX - rootX) / scale
          const y = (event.data.clientY - rootY) / scale

          newTreeNode[0].props.style ||= {}
          newTreeNode[0].props.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
          if (newTreeNode[0].componentName === 'Camera') {
            const regex = /translate\((\S+), (\S+)\)/;
            const match = newTreeNode[0].props.style.transform.match(regex);
            newTreeNode[0].props.style.x = match[1];
            newTreeNode[0].props.style.y = match[2];
          }
          if(choseSourceEl.dataset.shapeKey) {
            // 形状的属性
            newTreeNode[0].props.shapeKey = choseSourceEl.dataset.shapeKey
          }
           // 我需要区分视频组件类型
          if (choseSourceEl.dataset.type) {
            // 形状的属性
            newTreeNode[0].props.type = choseSourceEl.dataset.type
          }

          const operation = currentWorkspace.operation
          const selection = operation.selection
          selection.safeSelect(newTreeNode[0])
        }
      }
    }
  })

  engine.subscribeTo(PointerDownEvent, (event) => {
    if (engine.cursor.status !== CursorStatus.Normal) {
      return
    }

    const target: HTMLElement = event.data.target as any
    const nodeEl = target?.closest?.(`*[${engine.props.nodeIdAttrName}]`)

    const currentWorkspace =
      event.context?.workspace ?? engine.workbench.activeWorkspace

    if (!currentWorkspace || !nodeEl) return

    const operation = currentWorkspace.operation
    const selection = operation.selection
    const selectedNodes = selection.selectedNodes

    const nodeId = nodeEl?.getAttribute(engine.props.nodeIdAttrName)

    if (nodeId && (selectedNodes.length === 0 || (selectedNodes.length === 1 && selectedNodes[0].isRoot))) {
      console.log('PointerDownEvent')
      engine.dispatch(new DownSelectEvent(event.data),)
    }
  })
}
