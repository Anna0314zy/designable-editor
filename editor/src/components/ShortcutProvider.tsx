import { useEffect } from 'react'
import { useDesigner } from '@editor/react'
import { ShortcutManager } from '../shortcuts/ShortcutManager'

export const ShortcutProvider = () => {
  const engine = useDesigner()

  useEffect(() => {
    const manager = new ShortcutManager(engine)
    manager.mount()

    return () => {
      manager.unmount()
    }
  }, [engine])

  return null
}
