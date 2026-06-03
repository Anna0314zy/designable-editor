import React, { useEffect, useRef } from 'react'
import { Engine, GlobalRegistry } from '@editor/core'
import { DesignerEngineContext } from '../context'
import { IDesignerProps } from '../types'
import { GhostWidget } from '../widgets'
import { useDesigner } from '../hooks'
import { Layout } from './Layout'
import * as icons from '../icons'

GlobalRegistry.registerDesignerIcons(icons)

/**
 * 渲染 Designer 组件。
 *
 * @param {IDesignerProps} props - Designer 组件的 props。
 * @return {ReactElement} 渲染的 Designer 组件。
 */
export const Designer: React.FC<IDesignerProps> = ({
  prefixCls = 'ld-',
  theme = 'light',
  engine: propsEngine,
  ...props
}) => {
  const engine = useDesigner()
  const ref = useRef<Engine>()
  useEffect(() => {
    if (propsEngine) {
      if (propsEngine && ref.current) {
        if (propsEngine !== ref.current) {
          ref.current.unmount()
        }
      }
      propsEngine.mount()
      ref.current = propsEngine
    }
    return () => {
      if (propsEngine) {
        propsEngine.unmount()
      }
    }
  }, [propsEngine])

  if (engine)
    throw new Error(
      'There can only be one Designable Engine Context in the React Tree'
    )

  const designerProps = {
    ...props,
    prefixCls,
    theme,
    engine: propsEngine,
  }

  return (
    <Layout {...designerProps}>
      <DesignerEngineContext.Provider value={propsEngine}>
        {props.children}
        <GhostWidget />
      </DesignerEngineContext.Provider>
    </Layout>
  )
}
