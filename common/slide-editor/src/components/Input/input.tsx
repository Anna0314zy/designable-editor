/*
 * @Date: 2023-12-06 16:56:48
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-20 11:40:25
 * @FilePath: /slides-engine/common/slide-editor/src/components/Input/input.tsx
 */
import React from 'react'
import EditInput from './editInput'
import ViewInput from './viewInput'
import './_style.css'

const RichTextComponent = (props) => {
  return (
    props.mode === 'edit' ? <EditInput {...props}/> : <ViewInput {...props}/>
  )
}

export default RichTextComponent