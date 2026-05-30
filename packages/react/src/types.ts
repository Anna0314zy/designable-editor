import React from 'react'
import { Engine, IResource, IBehavior } from '@editor/core'
import { MenuProps } from 'antd'

export interface IDesignerLayoutProps {
  children?: React.ReactNode
  prefixCls?: string
  theme?: 'dark' | 'light' | (string & {})
  variables?: Record<string, string>
  position?: 'fixed' | 'absolute' | 'relative'
}
export interface IDesignerProps extends IDesignerLayoutProps {
  children?: React.ReactNode
  engine: Engine
}

export interface IDesignerComponents {
  [key: string]: DnFC<any> | DnComponent<any>
}

export interface IDesignerLayoutContext {
  theme?: 'dark' | 'light' | (string & {})
  prefixCls: string
  position: 'fixed' | 'absolute' | 'relative'
}

export interface IWorkspaceContext {
  id: string
  title?: string
  description?: string
}

export type DnFC<P = {}> = React.FC<P> & {
  Resource?: IResource[]
  Behavior?: IBehavior[]
}

export type DnComponent<P = {}> = React.ComponentType<P> & {
  Resource?: IResource[]
  Behavior?: IBehavior[]
}

export interface IGlobalDataContext {
  globalData: Record<string, number> | Record<string, any>
  setGlobalData: Function,
}

export interface IGlobalResourceContext {
  globalResource: any,
  setGlobalResource: Function,
}

export const pageItems: MenuProps['items'] = [
  {
    label: '新增节',
    key: 'add-section',
  },
  {
    label: '新增课件页',
    key: 'add-slide',
  },
  {
    label: '删除课件页',
    key: 'delete-slide',
  },
  // {
  //   label: '隐藏课件页',
  //   key: 'hide-slide',
  // },
  // {
  //   label: '复制课件页',
  //   key: 'copy-slide',
  // },
]

export const disabledPageItems: MenuProps['items'] = [
  {
    label: '新增节',
    key: 'add-section',
  },
  {
    label: '新增课件页',
    key: 'add-slide',
  },
  {
    label: '删除课件页',
    key: 'delete-slide',
    disabled: true,
  },
  // {
  //   label: '隐藏课件页',
  //   key: 'hide-slide',
  // },
  // {
  //   label: '复制课件页',
  //   key: 'copy-slide',
  // },
]

export const sectionItems: MenuProps['items'] = [
  {
    label: '删除节点',
    key: 'delete-section',
  },
  {
    label: '重命名节点',
    key: 'ren-slide',
  }
]

export const disabledSectionItems: MenuProps['items'] = [
  {
    label: '删除节点',
    key: 'delete-section',
    // disabled: true,
  },
  {
    label: '重命名节点',
    key: 'ren-slide',
  }
]

export const deleteSelectPages: MenuProps['items'] = [
  {
    label: '删除选中课件页',
    key: 'delete-sections',
    // disabled: true,
  }
]