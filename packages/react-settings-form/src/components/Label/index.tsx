import React, { useState } from 'react'
import { observer } from '@slides/react'


export const Label: React.FC = observer((props) => {
  
  return (
    <p style={{textAlign: 'left', width: '100%'}}>{props.value}</p>
  )
})
