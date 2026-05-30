/*
 * @Date: 2023-12-06 15:21:50
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-20 11:41:02
 * @FilePath: /slides-engine/editor/src/components/RichText/index.tsx
 */
import React from 'react'
import { createBehavior, createResource } from '@editor/core'
// import { moveable_class } from '@editor/react'
import { createFontFamilyOptions } from '@slide/fonts'

const FontFamilyOptions = createFontFamilyOptions()
import {
  useConnect,
  useReport,
  // useInstanceStore,
  // useResourceStore,
} from '@play/render'

import { genPropsSchema, setDefaultName } from '../_config/genBehaviorTmpl'
import {
  schemaBase_info,
  schemaBase_style,
  baseLocale_info,
  baseLocale_style,
} from '../_config/schema-base'

import {
  schemaText_info,
  schemaText_style,
  textLocale_info,
  textLocale_style,
  textDefaultProps,
} from "../_config/schema-text"

import {useGlobalData,useViewport} from '@editor/react'

import {RichTextComponent} from '@ld/slide-editor'
// console.log('Input', Input)
// import './styles.less'
export const RichTextBehavior = createBehavior({
  name: 'RichText',

  selector: (node) => node.componentName === 'RichText',
  designerProps: {
    propsSchema: genPropsSchema(
      [schemaBase_info, schemaText_info],
      [schemaBase_style, schemaText_style]
    ),
    defaultProps: {
      ...textDefaultProps,
      FontFamilyOptions
    },
    getComponentProps(node) {
      return {
        useConnect,
        useReport,
        useGlobalData,
        useViewport,
        id: node.id,
        pageId: node.root.id,
        data: undefined,
        getStyle: (val) => {
          node.props.style = {...node.props.style, ...val}
        },
        setData: (json) => {
          node.props.data = json
        },
        isSelect: node.props.isSelect,
        setDefaultName: (list, type) => {setDefaultName(list, type, node)},
      }
    },
  },

  designerLocales: {
    'zh-CN': {
      title: '矩形',
      settings: {
        info: {
          ...baseLocale_info,
          ...textLocale_info
        },
        style: {
          ...baseLocale_style,
          ...textLocale_style
        }
      },
    },
  },
})

export const RichTextResource = createResource({
  title: {
    'zh-CN': '富文本',
  },
  icon: 'ImageResource',
  elements: [
    {
      componentName: 'RichText',
      props: {
        title: '富文本',
        'x-decorator': 'FormItem',
        'x-component': 'RichText',
      },
    },
  ],
})

export const RichText = (props) => {
  return (
      <RichTextComponent
        mode="edit"
        {...props}
      />
    
  )
}
export const RichTextView = (props) => {
  return (
      <RichTextComponent
        {...props}
      />
  )
}