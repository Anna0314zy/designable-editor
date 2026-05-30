import hotkeys, { KeyHandler } from 'hotkeys-js'
import { Engine, TreeNode } from '@editor/core'

const SHORTCUT_SCOPE = 'slide-editor'
const CLONE_OFFSET = {
  x: 10,
  y: 10,
}

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
  private engine: Engine
  private clipboardNodes: TreeNode[] = []
  private registrations: Array<{ keys: string; handler: KeyHandler }> = []
  private previousFilter = hotkeys.filter

  constructor(engine: Engine) {
    this.engine = engine
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
    this.clipboardNodes = []
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
    this.register('ctrl+c,command+c', () => {
      this.copy()
    })
    this.register('ctrl+v,command+v', () => {
      this.paste()
    })
    this.register('ctrl+a,command+a', () => {
      this.selectAll()
    })
    this.register('backspace,delete', () => {
      this.delete()
    })
  }

  private getWorkspace() {
    return (
      this.engine.workbench.activeWorkspace ||
      this.engine.workbench.currentWorkspace
    )
  }

  private copy() {
    const workspace = this.getWorkspace()
    const selectedNodes = workspace?.operation.selection.selectedNodes || []
    this.clipboardNodes = selectedNodes.filter((node) => {
      return node && node !== node.root && node.allowClone()
    })
  }

  private paste() {
    if (!this.clipboardNodes.length) return
    TreeNode.clone(this.clipboardNodes, {
      offset: CLONE_OFFSET,
      selectCloned: true,
    })
  }

  private selectAll() {
    const operation = this.getWorkspace()?.operation
    if (!operation) return
    operation.selection.batchSelect(operation.tree.descendants)
  }

  private delete() {
    const selectedNodes =
      this.getWorkspace()?.operation.selection.selectedNodes || []
    TreeNode.remove(selectedNodes)
  }
}
