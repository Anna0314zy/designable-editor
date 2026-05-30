import React from 'react'
import { usePrefix } from '../hooks'

export interface IMarkPanelProps {
  children?: React.ReactNode
}

export const MarkPanel: React.FC<IMarkPanelProps> = (props) => {
  const prefix = usePrefix('mark-panel')
  return (
    <div
      className={prefix}
      {...props}
    >
      {props.children}
    </div>
  )
}