import React, { useState } from 'react'
import { observer } from '@slides/react'
import { Select } from '@slides/antd'

export interface IFilterProps {
  value?: string
  onChange?: (value?: string) => void
}

export const Filter: React.FC<IFilterProps> = observer((props) => {
  const [selectValue, setSelectValue] = useState(
    props.value ? props.value : 'none'
  )
  const onChange = (value: string) => {
    setSelectValue(value)
    props.onChange?.(value)
  }

  return (
    <Select
      value={selectValue}
      options={[
        { label: '原始', value: 'none' },
        { label: '高斯模糊', value: 'blur(5px)' },
        { label: '色调旋转', value: 'hue-rotate(90deg)' },
        { label: '反转', value: 'invert(100%)' },
        { label: '灰度', value: 'grayscale(50%)' },
        { label: '高亮', value: 'brightness(150%)' },
      ]}
      onChange={onChange}
    />
  )
})
