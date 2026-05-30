import { ICustomEvent } from '@editor/shared'
import { AbstractViewportEvent } from './AbstractViewportEvent'

export class ViewportScrollEvent
  extends AbstractViewportEvent
  implements ICustomEvent
{
  type = 'viewport:scroll'
}
