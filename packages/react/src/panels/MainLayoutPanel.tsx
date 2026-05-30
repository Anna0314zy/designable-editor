import React from 'react'
import { usePrefix } from '../hooks'

export interface IMainLayoutPanelProps {
  children?: React.ReactNode
}

export const MainLayoutPanel: React.FC<IMainLayoutPanelProps> = (props) => {
  const prefix = usePrefix('main-layout')
  return (
    <div
      className={prefix}
    >
      {props.children}
    </div>
  )
}