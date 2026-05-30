/*
 * @Date: 2024-01-19 18:38:25
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-04 14:20:54
 * @FilePath: /slides-engine/editor/src/components/Shape/EditingShape.tsx
 */
import React from 'react'
import { createResource, createBehavior } from '@editor/core'
import { useConnect, useReport } from '@play/render'
import {ShapeComponent} from '@slide/slide-shape'

import {
  schemaBase_info,
  schemaBase_style,
  baseLocale_info,
  baseLocale_style,
} from '../_config/schema-base'

import {
  schemaShape_info,
  schemaShape_style,
  shapeLocale_info,
  shapeLocale_style,
} from '../_config/schema-shape'

import { genPropsSchema, setDefaultName } from '../_config/genBehaviorTmpl'

export const ShapeBehavior = createBehavior({
  name: 'Shape',

  // 当选中画布中的节点(node)时，如果 selector 返回true，则会在右侧面板展示此配置表单，表单内容会同步到 node.props 中
  selector: (node) =>
    node.componentName === 'Shape',

  designerProps: {
    propsSchema: genPropsSchema(
      [schemaBase_info, schemaShape_info],
      [schemaBase_style, schemaShape_style],
    ),
    defaultProps: {
      style: {
        width: '100px',
        height: '100px',
        transform: 'translate(0px, 0px) rotate(0deg)',
        borderWidth: '4px',
        fill: 'rgba(24,144,255,1)',
        borderColor: 'rgba(0,0,255,1)',
        borderStyle: 'solid'
      }
    },
    getComponentProps(node) {
      return {
        useConnect,
        useReport,
        id: node.id,
        pageId: node.root.id,
        setDefaultName: (list, type) => {setDefaultName(list, type, node)}
      }
    }
  },

  designerLocales: {
    'zh-CN': {
      title: '形状',
      settings: {
        info: {
          ...baseLocale_info,
          ...shapeLocale_info,
        },
        style: {
          ...baseLocale_style,
          ...shapeLocale_style,
        },
      },
    },
  },
})

export const ShapeResource = createResource({
  title: {
    'zh-CN': '形状',
  },
  icon: 'ShapeResource',
  elements: [
    {
      // 画布上用这个组件来渲染, 与 content.tsx 中 components 的 key 对应
      componentName: 'Shape',
      props: {
        title: '形状',
        'x-component': 'Shape',
      },
    },
  ],
})

export const Shape = (props) => {
  return (
    <ShapeComponent
    {...props}
    mode="edit"
    />
  )
};
