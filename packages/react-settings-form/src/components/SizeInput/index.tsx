/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-06 11:09:31
 * @FilePath: /slides-engine/packages/react-settings-form/src/components/SizeInput/index.tsx
 */
import { InputNumber } from 'antd'
import { createPolyInput } from '../PolyInput'

const takeNumber = (value: any) => {
  const num = String(value)
    .trim()
    .replace(/[^-?\d\.]+/, '')
  if (num === '') return
  return Number(num)
}

const createUnitType = (type: string, step?: string | number) => {
  return {
    type,
    component: InputNumber,
    checker(value: any) {
      return String(value).includes(type)
    },
    toInputValue(value: any) {
      return takeNumber(value)
    },
    toChangeValue(value: any) {
      return `${takeNumber(value) || 0}${type === '倍' ? '' : type}`
    },
    step
  }
}

const createSpecialSizeOption = (type: string) => ({
  type: type === 'cover' ? '平铺' : '包含',
  checker(value: any) {
    if (value === type) return true
    return false
  },
  toChangeValue() {
    return type
  },
})

export const SizeInput = createPolyInput([createUnitType('px')])
export const LineHeightSizeInput = createPolyInput([createUnitType('倍', '0.1')])

export const BackgroundSizeInput = createPolyInput([
  createSpecialSizeOption('cover'),
  createSpecialSizeOption('contain'),
  // createUnitType('px'),
  // createUnitType('%'),
])
