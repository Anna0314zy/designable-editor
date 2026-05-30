import { useContext, useEffect } from 'react'
import { Engine } from '@editor/core'
import { DesignerEngineContext } from '../context'
import { isFn, globalThisPolyfill } from '@editor/shared'
export interface IEffects {
  (engine: Engine): void
}
/**
 * 生成设计器引擎。
 *
 * @param {IEffects} effects - 设计器的effects。
 * @return {Engine} 生成的设计器引擎。
 */
export const useDesigner = (effects?: IEffects): Engine => {
  const designer: Engine =
    globalThisPolyfill['__DESIGNABLE_ENGINE__'] ||
    useContext(DesignerEngineContext)
  useEffect(() => {
    if (isFn(effects)) {
      return effects(designer)
    }
  }, [])
  return designer
}
