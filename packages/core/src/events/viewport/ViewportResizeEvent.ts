import { ICustomEvent } from '@editor/shared'
import { AbstractViewportEvent } from './AbstractViewportEvent'

export class ViewportResizeEvent
  extends AbstractViewportEvent
  implements ICustomEvent
{
  type = 'viewport:resize'
}
