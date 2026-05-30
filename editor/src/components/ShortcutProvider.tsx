import { useEffect } from 'react'
import { useCommandManager } from '../commands/CommandProvider'
import { ShortcutManager } from '../shortcuts/ShortcutManager'

export const ShortcutProvider = () => {
  const commandManager = useCommandManager()

  useEffect(() => {
    const manager = new ShortcutManager(commandManager)
    manager.mount()

    return () => {
      manager.unmount()
    }
  }, [commandManager])

  return null
}
