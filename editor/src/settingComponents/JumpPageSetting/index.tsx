/*
 * @Date: 2024-02-02 14:37:47
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-05 09:49:16
 * @FilePath: /slides-engine/editor/src/settingComponents/ImgSettingBackground/index.tsx
 */
import React, { useState } from 'react'
import { observer } from '@slides/react'
import { Select } from '@slides/antd'
import { useTree } from '@editor/react';

export interface IJumpPageProps {
  value?: string
  onChange?: (value?: string) => void
}
export const JumpPageSetting: React.FC<IJumpPageProps> = observer((props) => {
  const tree = useTree()
  const [selectValue, setSelectValue] = useState(props.value || '');

  const onChange = (value: string) => {
    setSelectValue(value);
    props.onChange(value)
    const info = {...tree.props.info}
    
    if (value !== '') {
      info.jumpPage = value
    } else {
      delete info.jumpPage
    }

    tree.setProps({
        info
    })
  };

  return (
    <Select
    value={selectValue}
    options={[
      { label: '无', value: '' },
      { label: '下一页', value: 'next' }
    ]}
    onChange={onChange}
  />
  )
})
