/*
 * @Date: 2024-02-02 14:37:47
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-03-04 11:47:47
 * @FilePath: /slides-engine/packages/react-settings-form/src/components/RatioSetter/index.tsx
 */
import React, { useState } from 'react'
import { observer } from '@slides/react'
import { Switch } from '@slides/antd'
import { useSelectedNode } from '@editor/react';

interface IRatioProps {
  value?: string
  onChange?: (value?: boolean) => void
}
export const RatioSetter: React.FC<IRatioProps> = observer((props) => {
  console.log(props,'pppp')
  const plainOptions = [
    { label: '锁定', value: true },
    { label: '解锁', value: false }
  ];
  const [value, setValue] = useState(Boolean(props.value));
  const node = useSelectedNode()
  // 按原始比例设置高度
  const setPicHeight = ()  => {
    const style = node.props.style
    const ratio = node.props.height / node.props.width
    node.setProps({
      'style': {
        ...style,
        height: `${Math.floor(parseInt(style.width, 10) * ratio)}px`
      }
    })
  }
  const onChange = (value: boolean) => {
    setValue(value);
    props.onChange(value)
    // value && setPicHeight()
  };

  return (
    <Switch checked={value} onChange={onChange} />
    // <Radio.Group options={plainOptions} onChange={onChange} value={value} />
  )
})
