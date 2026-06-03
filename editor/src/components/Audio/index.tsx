/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-08 16:25:32
 * @FilePath: /slides-engine/editor/src/components/Audio/index.tsx
 */
import React from 'react'
import { createResource, createBehavior } from '@editor/core'
import { moveable_class } from '@editor/react'
import {
  useConnect,
  useReport,
  useInstanceStore,
  useResourceStore,
} from '@play/render'

import { useResourceData } from '@editor/react'

import { schemaAudio_info, audioLocale_info } from '../_config/schema-audio'

import { genPropsSchema, setDefaultName } from '../_config/genBehaviorTmpl'

// import { AudioComponent } from '../../../../common/ld-plyr/src'

export const AudioBehavior = createBehavior({
  name: 'Audio',

  // 当选中画布中的节点(node)时，如果 selector 返回true，则会在右侧面板展示此配置表单，表单内容会同步到 node.props 中
  selector: (node) => node.componentName === 'Audio',

  designerProps: {
    propsSchema: genPropsSchema([schemaAudio_info], []),
    defaultProps: {
      style: {},
    },
    getComponentProps(node) {
      return {
        useConnect,
        useReport,
        useResourceData,
        id: node.id,
        pageId: node.root.id,
        setDefaultName: (list, type) => {
          setDefaultName(list, type, node)
        },
        md52Url: (list, md5) => {
          console.log(123, list, md5)
          // const workbench = engine?.workbench
          // const id = workbench ? workbench.activeWorkspace.id : ''
          // const recourseList = list[id]
          if (list && list.length && md5) {
            const uploadConfig = (window as any).__SLIDES_UPLOAD_CONFIG__
            const host = uploadConfig?.cdnPathList?.[0] || uploadConfig?.cdnPath || ''
            const index = list.findIndex((resource) => resource.fileMd5 === md5)
            return index >= 0 ? host + list[index]['cosFullPath'] : null
          }
          return null
        },
      }
    },
  },

  designerLocales: {
    'zh-CN': {
      title: '音频',
      settings: {
        info: {
          ...audioLocale_info,
        },
        style: {},
      },
    },
  },
})

export const AudioResource = createResource({
  title: {
    'zh-CN': '音频',
  },
  icon: 'AudioSource',
  elements: [
    {
      // 画布上用这个组件来渲染, 与 content.tsx 中 components 的 key 对应
      componentName: 'Audio',
      props: {
        title: '音频',
        style: {},
        'x-component': 'Audio',
      },
    },
  ],
})

export const Audio = (props) => {
  const { treeNodeProps, isSelect, ...componentProps } = props
  // 原则上只向 VideoComponent() 中传递 mode + node.props + title + className
  return (
    <div>
      {/* <AudioComponent
        mode="edit"
        {...componentProps}
        treeNode={treeNodeProps}
        style={{
          position: 'absolute',
          padding: '10px',
          border: '1px solid #ddd',
          ...props.style,
          width: '100px',
          height: '100px',
        }}
      /> */}
    </div>
  )
}
