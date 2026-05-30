/*
 * @Date: 2023-12-05 17:50:08
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-29 17:00:52
 * @FilePath: /slides-engine/packages/react-settings-form/src/types.ts
 */
import React from 'react'
import { Form } from '@slides/core'
export interface ISettingFormProps {
  className?: string
  style?: React.CSSProperties
  uploadAction?: string
  components?: Record<string, React.FC<any>>
  effects?: (form: Form) => void
  scope?: any,
  extra?: any
  updateThumbnail: Function
}
