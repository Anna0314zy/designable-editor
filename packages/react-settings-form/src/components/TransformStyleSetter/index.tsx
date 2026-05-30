import React from 'react'
import { observer } from '@slides/react'
import { BoxTransformStyle } from '../BoxTransformStyle'

export interface ITransformStyleSetterProps {
  value?: string
  onChange?: (value: string) => void
}

export const TransformStyleSetter: React.FC<ITransformStyleSetterProps> =
  observer((props) => {
    return <BoxTransformStyle {...props} labels={['x', 'y']} />
  })
