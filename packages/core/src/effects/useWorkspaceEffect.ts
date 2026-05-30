import { Engine } from '../models'
import { ICustomEvent } from '@editor/shared'
import { IEngineContext } from '../types'
import { SelectNodeEvent } from '../events'

export const useWorkspaceEffect = (engine: Engine) => {
  // drag:node等方法获取的EventContext的workspace和当前的activeWorkspace不一致，因此注释掉了这段代码。同时以下这些操作都不会触发activeWorkspace的变化，因此去掉了这段逻辑。
  // engine.subscribeWith<ICustomEvent<any, IEngineContext>>(
  //   [
  //     'append:node',
  //     'insert:after',
  //     'insert:before',
  //     'insert:children',
  //     'drag:node',
  //     'drop:node',
  //     'prepend:node',
  //     'remove:node',
  //     'select:node',
  //     'update:children',
  //     'wrap:node',
  //     'update:node:props',
  //   ],
  //   (event) => {
  //     if (event.context?.workbench) {
  //       engine.workbench.setActiveWorkspace(event.context.workspace)
  //     }
  //   }
  // )
  // engine.subscribeTo(SelectNodeEvent, (event) => {
  //   console.log('file: useWorkspaceEffect.ts:30 ~ engine.subscribeTo ~ event:', event)
  //   engine.workbench.eachWorkspace((workspace) => {
  //     if (workspace !== event.context.workspace) {
  //       workspace.operation.selection.clear()
  //     }
  //   })
  // })
}
