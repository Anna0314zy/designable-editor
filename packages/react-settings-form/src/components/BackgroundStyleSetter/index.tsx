/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-29 14:02:48
 * @FilePath: /slides-engine/packages/react-settings-form/src/components/BackgroundStyleSetter/index.tsx
 */
import React, {useState} from 'react'
import { useField, Field, observer } from '@slides/react'
import { usePrefix } from '@editor/react'
import { Select, Input } from '@slides/antd'
import { FoldItem } from '../FoldItem'
import { ColorInput } from '../ColorInput'
import { BackgroundSizeInput } from '../SizeInput'
import { BackgroundImageInput } from '../ImageInput'
import { InputItems } from '../InputItems'
// import { COSUpload } from '../COSUpload'
import cls from 'classnames'
import { useSelectedNode } from '@editor/react'

export interface IBackgroundStyleSetterProps {
  className?: string
  style?: React.CSSProperties,
  COSUpload?: any,
  treeNode?: any
}

export const BackgroundStyleSetter: React.FC<IBackgroundStyleSetterProps> =
  observer((props) => {
    const treeNode = useSelectedNode()
    const hasImage = treeNode && treeNode.props.style?.backgroundImage
    const field = useField()
    const prefix = usePrefix('background-style-setter')
    const [selectValue, setSelectValue] = useState(hasImage ? 'bgcImage' : 'bgcColor')
    const onChange = (value: string) => {
      setSelectValue(value)
    }
    const colorChange = (value: string) => {
      delete treeNode.props.style.backgroundImage
      delete treeNode.props.style.backgroundSize
    }
    return (
      <FoldItem className={cls(prefix, props.className)} label={field.title}>
        <FoldItem.Base>
        <Select
          value={selectValue}
          options={[
            { label: '背景色', value: 'bgcColor' },
            { label: '背景图片', value: 'bgcImage' }
          ]}
          onChange={onChange}
        />
        </FoldItem.Base>
        <FoldItem.Extra>
          <InputItems>
            {selectValue === 'bgcColor' ? <InputItems.Item icon="BackgroundColorIcon">
              <Field
                name="backgroundColor"
                basePath={field.address.parent()}
                component={[ColorInput, {
                  onChange: colorChange
                }]}
              />
            </InputItems.Item> : 
            <>
            <InputItems.Item icon="Image">
              <Field
                name="backgroundImage"
                basePath={field.address.parent()}
                component={[props.COSUpload]}
              />
            </InputItems.Item>
            <InputItems.Item icon="ImageSize">
              <Field
                name="backgroundSize"
                basePath={field.address.parent()}
                component={[BackgroundSizeInput]}
              />
            </InputItems.Item></>}
            {/* <InputItems.Item icon="Repeat" width="50%">
              <Field
                name="backgroundRepeat"
                basePath={field.address.parent()}
                component={[
                  Select,
                  { style: { width: '100%' }, placeholder: 'Repeat' },
                ]}
                dataSource={[
                  {
                    label: 'No Repeat',
                    value: 'no-repeat',
                  },
                  {
                    label: 'Repeat',
                    value: 'repeat',
                  },
                  {
                    label: 'Repeat X',
                    value: 'repeat-x',
                  },
                  {
                    label: 'Repeat Y',
                    value: 'repeat-y',
                  },
                  {
                    label: 'Space',
                    value: 'space',
                  },
                  {
                    label: 'Round',
                    value: 'round',
                  },
                ]}
              />
            </InputItems.Item> */}
            {/* <InputItems.Item icon="Position">
              <Field
                name="backgroundPosition"
                basePath={field.address.parent()}
                component={[Input, { placeholder: 'center center' }]}
              />
            </InputItems.Item> */}
          </InputItems>
        </FoldItem.Extra>
      </FoldItem>
    )
  })
