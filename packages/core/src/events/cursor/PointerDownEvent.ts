import { ICustomEvent } from '@editor/shared'
import { AbstractCursorEvent } from './AbstractCursorEvent'

export class PointerDownEvent
  extends AbstractCursorEvent
  implements ICustomEvent
{
  type = 'mouse:down'
}

export class DownSelectEvent
  extends AbstractCursorEvent
  implements ICustomEvent
{
  type = 'mouse:down'
}