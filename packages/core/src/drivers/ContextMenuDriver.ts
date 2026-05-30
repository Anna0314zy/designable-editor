import { EventDriver } from '@editor/shared'
import { Engine } from '../models/Engine'
import { ContextMenuEvent } from '../events'

export class ContextMenuDriver extends EventDriver<Engine> {
    onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        this.dispatch(
            new ContextMenuEvent({
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                target: e.target,
                view: e.view,
            })
        )
    }


    attach() {
        this.addEventListener('contextmenu', this.onContextMenu, { mode: 'onlyChild' });
    }

    detach() {
        this.removeEventListener('contextmenu', this.onContextMenu, { mode: 'onlyChild' });
    }
}
