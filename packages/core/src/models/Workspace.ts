import { Engine } from './Engine'
import { Viewport } from './Viewport'
import { Operation, IOperation } from './Operation'
import { History } from './History'
import { uid, ICustomEvent, EventContainer } from '@editor/shared'
import {
  HistoryGotoEvent,
  HistoryRedoEvent,
  HistoryUndoEvent,
  HistoryPushEvent,
} from '../events'
import { IEngineContext } from '../types'
export interface IViewportMatcher {
  contentWindow?: Window
  viewportElement?: HTMLElement
}

export interface IWorkspace {
  id?: string
  title?: string
  description?: string
  operation?: IOperation
  pageType?: number
  pageInfo?: any
}

export interface IWorkspaceProps {
  id?: string
  title?: string
  description?: string
  contentWindow?: Window
  viewportElement?: HTMLElement
  pageType?: number
}

//工作区模型
export class Workspace {
  id: string

  title: string

  description: string

  engine: Engine

  viewport: Viewport

  outline: Viewport

  operation: Operation

  history: History<Workspace>

  props: IWorkspaceProps

  pageType: number

  constructor(engine: Engine, props: IWorkspaceProps) {
    this.engine = engine
    this.props = props
    this.id = props.id || uid()
    this.pageType = props.pageType
    this.viewport = new Viewport({
      engine: this.engine,
      workspace: this,
      viewportElement: props.viewportElement,
      contentWindow: props.contentWindow,
      nodeIdAttrName: this.engine.props.nodeIdAttrName,
      moveSensitive: true,
      moveInsertionType: 'all',
    })
    this.outline = new Viewport({
      engine: this.engine,
      workspace: this,
      viewportElement: props.viewportElement,
      contentWindow: props.contentWindow,
      nodeIdAttrName: this.engine.props.outlineNodeIdAttrName,
      moveSensitive: false,
      moveInsertionType: 'block',
    })
    this.operation = new Operation(this)
    this.history = new History(this, {
      onPush: (item) => {
        this.operation.dispatch(new HistoryPushEvent(item))
      },
      onRedo: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryRedoEvent(item))
      },
      onUndo: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryUndoEvent(item))
      },
      onGoto: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryGotoEvent(item))
      },
    })
  }

  getEventContext(): IEngineContext {
    return {
      workbench: this.engine.workbench,
      workspace: this,
      engine: this.engine,
      viewport: this.viewport,
    }
  }

  attachEvents(container: EventContainer, contentWindow: Window) {
    this.engine.attachEvents(container, contentWindow, this.getEventContext())
  }

  detachEvents(container: EventContainer) {
    this.engine.detachEvents(container)
  }

  dispatch(event: ICustomEvent) {
    return this.engine.dispatch(event, this.getEventContext())
  }

  serialize(): IWorkspace {
    return {
      id: this.id,
      pageType: this.pageType,
      pageInfo: this.operation.serialize().tree
    }
  }

  from(workspace?: IWorkspace) {
    if (!workspace) return
    if (workspace.operation) {
      this.operation.from(workspace.operation)
    }
    if (workspace.id) {
      this.id = workspace.id
    }
    if (workspace.title) {
      this.title = workspace.title
    }
    if (workspace.description) {
      this.description = workspace.description
    }
  }
}
