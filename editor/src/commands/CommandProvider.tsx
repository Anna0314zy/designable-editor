import React, { createContext, useContext, useMemo } from 'react'
import { useDesigner, useGlobalData } from '@editor/react'
import { CommandManager } from './CommandManager'

const CommandManagerContext = createContext<CommandManager | null>(null)

export const CommandProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const engine = useDesigner()
  const { viewportPercentage } = useGlobalData()

  const commandManager = useMemo(() => {
    return new CommandManager(engine, {
      getViewportPercentage: () => viewportPercentage || 1,
    })
  }, [engine, viewportPercentage])

  return (
    <CommandManagerContext.Provider value={commandManager}>
      {children}
    </CommandManagerContext.Provider>
  )
}

export const useCommandManager = () => {
  const commandManager = useContext(CommandManagerContext)
  if (!commandManager) {
    throw new Error('useCommandManager must be used inside CommandProvider')
  }
  return commandManager
}
