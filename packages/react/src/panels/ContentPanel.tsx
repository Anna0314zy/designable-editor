import React from 'react'
import { usePrefix } from '../hooks'

export interface IContentPanelProps {
  children?: React.ReactNode
}

export const ContentPanel: React.FC<IContentPanelProps> = (props) => {
  const prefix = usePrefix('content-panel')
  return (
    <div
      className={prefix}
      {...props}
    >
      {props.children}
    </div>
  )
}