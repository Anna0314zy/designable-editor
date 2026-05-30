import React, { useState } from 'react'
import { observer } from '@slides/react'
import { Select } from '@slides/antd'

export interface IShapeProps {
  value?: string
  onChange?: (value?: string) => void
}

export const Shape: React.FC<IShapeProps> = observer((props) => {
  const [selectValue, setSelectValue] = useState(
    props.value ? props.value : 'rectangle'
  )
  const onChange = (value: string) => {
    setSelectValue(value)
    props.onChange?.(value)
  }

  return (
    <Select
      value={selectValue}
      options={[
        { label: '矩形', value: 'rectangle' },
        { label: '正方形', value: 'square' },
        { label: '圆形', value: 'round' },
        { label: '三角形', value: 'triangle' },
        { label: '菱形', value: 'rhombus' },
      ]}
      onChange={onChange}
    />
  )
})
