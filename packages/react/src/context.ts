import { createContext } from 'react'
import { TreeNode, Engine } from '@editor/core'
import {
  IDesignerLayoutContext,
  IWorkspaceContext,
  IDesignerComponents
} from './types'

/**
 * 设计器组件 Context
 */
export const DesignerComponentsContext = createContext<IDesignerComponents>({})

/**
 * Context for designer layout.
 */
export const DesignerLayoutContext = createContext<IDesignerLayoutContext>(null)

/**
 * Context for designer engine.
 */
export const DesignerEngineContext = createContext<Engine>(null)

/**
 * Context for tree node.
 */
export const TreeNodeContext = createContext<TreeNode>(null)

/**
 * Context for workspace.
 */
export const WorkspaceContext = createContext<IWorkspaceContext>(null)

