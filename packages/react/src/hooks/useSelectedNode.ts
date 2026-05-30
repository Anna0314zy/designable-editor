import { useSelected } from './useSelected'
import { useTree } from './useTree'

export const useSelectedNode = (workspaceId?: string) => {
  const selected = useSelected(workspaceId)
  const tree = useTree(workspaceId)
  const node = tree?.findById?.(selected[0])
  if (node.parent?.componentName === 'Group') {
    return node.parent
  }
  return tree?.findById?.(selected[0])
}

/**
 * @deprecated
 * please use useSelectedNode
 */
export const useCurrentNode = useSelectedNode
