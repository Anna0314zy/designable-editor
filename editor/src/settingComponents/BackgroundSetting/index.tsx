import React from 'react'
// import { observer } from '@slides/react'
import { BackgroundStyleSetter } from '@editor/react-settings-form'
import { COSUpload } from '../COSUpload'

export interface IFilterProps {
  value?: string
  onChange?: (value?: string) => void
}

export const BackgroundSetting: React.FC<IFilterProps> = () => {
  return (
    <BackgroundStyleSetter COSUpload={COSUpload}/>
  )
}
