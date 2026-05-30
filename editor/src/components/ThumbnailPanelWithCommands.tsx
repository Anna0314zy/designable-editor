import React from 'react'
import { ThumbnailPanelWithErrorBoundary as ThumbnailPanel } from '@editor/react'
import { useCommandManager } from '../commands/CommandProvider'

export const ThumbnailPanelWithCommands: React.FC<any> = (props) => {
  const commandManager = useCommandManager()

  return <ThumbnailPanel {...props} commandManager={commandManager} />
}
