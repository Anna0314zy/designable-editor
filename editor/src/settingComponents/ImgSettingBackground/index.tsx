/*
 * @Date: 2024-02-02 14:37:47
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-27 15:13:14
 * @FilePath: /slides-engine/editor/src/settingComponents/ImgSettingBackground/index.tsx
 */
import React, { useState } from 'react'
import { observer } from '@slides/react'
import { Switch } from '@slides/antd'
import { useTree, useSelectedNode } from '@editor/react';
import { useSavePage } from '../../hooks/useSavePage';

export interface IImgToBkgProps {
  value?: boolean
  onChange?: (value?: boolean) => void
}
export const ImgSettingBackground: React.FC<IImgToBkgProps> = observer((props) => {
  console.log()
  const tree = useTree()
  const node = useSelectedNode()
  const [value, setValue] = useState(props.value);
  const [saveCurrentPage] = useSavePage()
  const onChange = (checked: boolean) => {
    setValue(checked);
    props.onChange(checked)
    const style = {...tree.props.style}
    
    if (checked) {
      style.backgroundImage = node.props.src
      style.backgroundSize = tree.props.style.backgroundImage ? tree.props.style.backgroundImage : 'cover'
    } else {
      delete style.backgroundImage
      delete style.backgroundSize
    }
    tree.setProps({
      style
    })
    const children = tree.children
    children.forEach(component => {
      if (component.props["x-component"] == "Img") {
        component.setProps({
          info: {
            ...component.props.info,
            isBackground: component.props.src === node.props.src ? checked : false
          }
        })
      }
    });
    saveCurrentPage()
  };

  return (
    <Switch checked={value} onChange={onChange} />
  )
})
