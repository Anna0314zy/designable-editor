import { ICustomEvent } from '@editor/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class MakeGroupNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'group:make'
}
