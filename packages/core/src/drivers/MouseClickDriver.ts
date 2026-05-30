import { EventDriver } from '@editor/shared'
import { Engine } from '../models/Engine'
import { MouseClickEvent, MouseDoubleClickEvent } from '../events'

export class MouseClickDriver extends EventDriver<Engine> {
  onMouseClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target?.closest(`*[${this.engine.props.clickStopPropagationAttrName}]`)
    ) {
      return
    }
    this.dispatch(
      new MouseClickEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      })
    )
  }

  onMouseDoubleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target?.closest(`*[${this.engine.props.clickStopPropagationAttrName}]`)
    ) {
      return
    }
    this.dispatch(
      new MouseDoubleClickEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      })
    )
  }

  // onMouseDown = (e: MouseEvent) => {
  //   const target = e.target as HTMLElement

  //   if (target?.closest(`*[${this.engine.props.nodeIdAttrName}]`)) {
  //   console.log('file: MouseClickDriver.ts:46 ~ MouseClickDriver ~ target:', target)

  //     this.dispatch(
  //       new PointerDownEvent({
  //         clientX: e.clientX,
  //         clientY: e.clientY,
  //         pageX: e.pageX,
  //         pageY: e.pageY,
  //         target: e.target,
  //         view: e.view,
  //       })
  //     )
  //   }
  // }

  onClickToolBar = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const sourceEl = target?.closest(`*[${this.engine.props.sourceIdAttrName}]`)
    const isDisabled = target.dataset.disabled === 'true';
    if (
      sourceEl && !isDisabled
    ) {
      this.dispatch(
        new MouseClickEvent({
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target,
          view: e.view,
        })
      )
    }
  }

  attach(container) {
    this.addEventListener('click', this.onMouseClick, {
      mode: 'onlyChild',
    })

    this.addEventListener('dblclick', this.onMouseDoubleClick, {
      mode: 'onlyChild',
    })

    // for usePositionEffect
    this.addEventListener('click', this.onClickToolBar);

    // this.addEventListener('pointerdown', this.onMouseDown, {
    //   mode: 'onlyChild',
    // })
  }

  detach() {
    this.removeEventListener('click', this.onClickToolBar);

    this.removeEventListener('click', this.onMouseClick,)

    // this.removeEventListener('pointerdown', this.onMouseDown, {
    //   mode: 'onlyChild'
    // });

    this.removeEventListener('dblclick', this.onMouseDoubleClick, {
      mode: 'onlyChild',
    })
  }
}
