import { ICustomEvent } from '@editor/shared'
import { AbstractCursorEvent } from './AbstractCursorEvent'

export class MouseClickEvent
  extends AbstractCursorEvent
  implements ICustomEvent
{
  type = 'mouse:click'
}

export class MouseDoubleClickEvent
  extends AbstractCursorEvent
  implements ICustomEvent
{
  type = 'mouse:dblclick'
}


export class ContextMenuEvent
  extends AbstractCursorEvent
  implements ICustomEvent
{
  type = 'contextmenu:click'
}