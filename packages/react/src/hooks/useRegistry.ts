import { GlobalRegistry, IDesignerRegistry } from '@editor/core'
import { globalThisPolyfill } from '@editor/shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
