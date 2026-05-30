/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { ComponentTreeWidget, useTreeNode } from '@editor/react'
import { observer } from '@slides/reactive-react'
import 'antd/dist/reset.css'

export const Content = () => (
  <ComponentTreeWidget
    components={{
      Field: observer((props) => {
        const node = useTreeNode()
        return (
          <span
            {...props}
            style={{
              // background: '#eee',
              background: 'red',
              display: 'inline-block',
              ...props.style,
              padding: '10px 20px',
              border: '1px solid #ddd',
            }}
          >
            <span data-content-editable="title">{node.props.title}</span>
            {props.children}
          </span>
        )
      }),
      Card: (props) => {
        console.log('file: content.tsx:29 ~ props:', props);
        return (
          <div
            {...props}
            style={{
              background: 'green',
              // background: '#eee',
              border: '1px solid #ddd',
              display: 'flex',
              padding: 10,
              height: props.children ? 'auto' : 150,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {props.children ? props.children : <span>拖拽字段进入该区域</span>}
          </div>
        )
      },
    }}
  />
)
