import React from 'react'
import { observer } from '@slides/reactive-react'
import { useWorkbench } from '../hooks'
import { Workspace } from './Workspace'

interface IWorkbenchProps {
  children?: React.ReactNode
}

export const Workbench: React.FC<IWorkbenchProps> = observer((props) => {
  const workbench = useWorkbench()
  return (
    <Workspace id={workbench.currentWorkspace?.id}>{props.children}</Workspace>
  )
})
