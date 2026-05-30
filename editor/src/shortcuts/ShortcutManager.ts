import hotkeys, { KeyHandler } from 'hotkeys-js'
import { CommandManager } from '../commands/CommandManager'

const SHORTCUT_SCOPE = 'slide-editor'

const isEditableTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement
  const tagName = element?.tagName

  return (
    element?.isContentEditable ||
    ((tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') &&
      !(element as HTMLInputElement).readOnly)
  )
}

export class ShortcutManager {
  private commandManager: CommandManager
  private registrations: Array<{ keys: string; handler: KeyHandler }> = []
  private previousFilter = hotkeys.filter

  constructor(commandManager: CommandManager) {
    this.commandManager = commandManager
  }

  mount() {
    this.previousFilter = hotkeys.filter
    hotkeys.filter = (event) => {
      return !isEditableTarget(event.target)
    }
    hotkeys.setScope(SHORTCUT_SCOPE)
    this.registerDefaults()
  }

  unmount() {
    this.registrations.forEach(({ keys, handler }) => {
      hotkeys.unbind(keys, SHORTCUT_SCOPE, handler)
    })
    this.registrations = []
    hotkeys.deleteScope(SHORTCUT_SCOPE, 'all')
    hotkeys.filter = this.previousFilter
  }

  private register(keys: string, handler: KeyHandler) {
    const boundHandler: KeyHandler = (event, hotkeysEvent) => {
      event.preventDefault()
      event.stopPropagation()
      return handler(event, hotkeysEvent)
    }
    hotkeys(keys, SHORTCUT_SCOPE, boundHandler)
    this.registrations.push({ keys, handler: boundHandler })
  }

  private registerDefaults() {
    ;(['copy', 'paste', 'selectAll', 'delete'] as const).forEach((id) => {
      const command = this.commandManager.getCommand(id)
      command?.shortcuts?.forEach((shortcut) => {
        this.register(shortcut, () => {
          this.commandManager.execute(id)
        })
      })
    })
  }
}
