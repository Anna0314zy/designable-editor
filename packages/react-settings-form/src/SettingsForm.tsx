import React, { useEffect, useMemo, useRef } from 'react'
import { createForm } from '@slides/core'
import { reaction } from '@slides/reactive'

import { Form,Input } from '@slides/antd'
import { observer } from '@slides/react'
import { requestIdle, cancelIdle } from '@editor/shared'
import {
  usePrefix,
  useOperation,
  useSelectedNode,
  useWorkbench,
  IconWidget,
  useSelected,
} from '@editor/react'
import { SchemaField } from './SchemaField'
import { ISettingFormProps } from './types'
import { SettingsFormContext } from './shared/context'
import { useLocales, useSnapshot } from './effects'
import cls from 'classnames'
import { Empty } from 'antd'

import './styles.less'

const GlobalState = {
  idleRequest: null,
}

export const SettingsForm: React.FC<ISettingFormProps> = observer(
  (props) => {
    const workbench = useWorkbench()
    const currentWorkspace =
      workbench?.activeWorkspace || workbench?.currentWorkspace
    const currentWorkspaceId = currentWorkspace?.id
    const operation = useOperation(currentWorkspaceId)
    const node = useSelectedNode(currentWorkspaceId)
    const prefix = usePrefix('settings-form')
    const schema = node?.designerProps?.propsSchema
    const selected = useSelected(currentWorkspaceId)


    const isEmpty = !(
      node &&
      node.designerProps?.propsSchema &&
      selected.length === 1
    )


    const disposeRef = useRef<() => void>();
    const form = useMemo(() => {
      if (disposeRef.current) {
        disposeRef.current()
      }
      disposeRef.current = reaction(() => {
        return JSON.stringify(node?.props)
      }, (newValue,oldValue) => {
        if (newValue !== oldValue) {
          if(node.isRoot) {
            props.updateThumbnail()
          }
        }
      })

      console.log('node====>', node, )
      return createForm({
        initialValues: node?.designerProps?.defaultProps,
        values: node?.props,
        effects(form) {
          useLocales(node)
          useSnapshot(operation)
          props.effects?.(form)
        },
      })

    }, [node, node?.props, schema, operation, isEmpty])

    useEffect(() => {
      return () => {
        console.log('settingForm unmounted')
      }
    }, [])

    const render = () => {
      if (!node) {
        return null
      }

      if(isEmpty) {
        return (
          <div className={prefix + '-empty'}>
            <Empty />
          </div>
        )
      }
      
      return (
        <div
          className={cls(prefix, props.className)}
          style={props.style}
          key={node.id}
        >
          <SettingsFormContext.Provider value={props}>
            <Form
              form={form}
              colon={false}
              labelWidth={120}
              labelAlign="left"
              wrapperAlign="right"
              feedbackLayout="none"
              tooltipLayout="text"
            >
              <SchemaField
                schema={schema}
                components={props.components}
                scope={{ $node: node, ...props.scope }}
                extra={props.extra}
              />
            </Form>
          </SettingsFormContext.Provider>
        </div>
      )
      // return (
      //   <div className={prefix + '-empty'}>
      //     <Empty />
      //   </div>
      // )
    }

    return (
      <IconWidget.Provider tooltip>
        <div className={prefix + '-wrapper'}>
          {/* {!isEmpty && <NodePathWidget workspaceId={currentWorkspaceId} />} */}
          <div className={prefix + '-content'}>{render()}</div>
        </div>
      </IconWidget.Provider>
    )
  },
  {
    scheduler: (update) => {
      cancelIdle(GlobalState.idleRequest)
      GlobalState.idleRequest = requestIdle(update, {
        timeout: 500,
      })
    },
  }
)
