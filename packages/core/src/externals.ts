import { isArr } from '@editor/shared'
import { untracked } from '@slides/reactive'
import { DEFAULT_DRIVERS, DEFAULT_EFFECTS, DEFAULT_SHORTCUTS } from './presets'
import { Engine, TreeNode } from './models'
import {
  IEngineProps,
  IResourceCreator,
  IBehaviorCreator,
  IDesignerLocales,
  IResource,
  IBehavior,
  IBehaviorHost,
  IResourceHost,
} from './types'
import { mergeLocales } from './internals'

/**
 * 检查给定的值是否为行为主机。
 *
 * @param {any} val - 要检查的值。
 * @returns {boolean} 如果值是行为主机，则返回true；否则返回false。
 */
export const isBehaviorHost = (val: any): val is IBehaviorHost =>
  val?.Behavior && isBehaviorList(val.Behavior)

/**
 * 检查一个值是否为 IBehavior 对象的数组。
 *
 * @param {any} val - 要检查的值。
 * @return {boolean} 如果值是 IBehavior 对象的数组，则返回 true；否则返回 false。
 */
export const isBehaviorList = (val: any): val is IBehavior[] =>
  Array.isArray(val) && val.every(isBehavior)

/**
 * 检查提供的值是否是 IBehavior 类型的实例
 *
 * @param {any} val - 需要检查的值
 * @return {boolean} 如果是 IBehavior 的实例，则返回 true，否则返回 false
 */
export const isBehavior = (val: any): val is IBehavior =>
  val?.name ||
  val?.selector ||
  val?.extends ||
  val?.designerProps ||
  val?.designerLocales

/**
 * 检查一个值是否是资源主机。
 *
 * @param {any} val - 要检查的值。
 * @returns {boolean} 如果值是资源主机，则返回true，否则返回false。
 */
export const isResourceHost = (val: any): val is IResourceHost =>
  val?.Resource && isResourceList(val.Resource)

/**
 * 判断给定的值是否为IResource对象的数组。
 *
 * @param {any} val - 要检查的值。
 * @return {boolean} 如果值是IResource对象的数组，则返回true，否则返回false。
 */
export const isResourceList = (val: any): val is IResource[] =>
  Array.isArray(val) && val.every(isResource)

/**
 * 检查给定的值是否为资源。
 *
 * @param {any} val - 要检查的值。
 * @return {boolean} 如果值是资源，则返回true，否则返回false。
 */
export const isResource = (val: any): val is IResource =>
  val?.node && !!val.node.isSourceNode && val.node instanceof TreeNode

export const createLocales = (...packages: IDesignerLocales[]) => {
  const results = {}
  packages.forEach((locales) => {
    mergeLocales(results, locales)
  })
  return results
}

/**
 * 根据提供的行为属性创建行为数组
 *
 * @param {Array<IBehaviorCreator | IBehaviorCreator[]>} ...behaviors - 行为属性的设置
 * @return {IBehavior[]} 行为数组
 */
export const createBehavior = (
  ...behaviors: Array<IBehaviorCreator | IBehaviorCreator[]>
): IBehavior[] => {
  return behaviors.reduce((buf: any[], behavior) => {
    if (isArr(behavior)) return buf.concat(createBehavior(...behavior))
    const { selector } = behavior || {}
    if (!selector) return buf
    if (typeof selector === 'string') {
      behavior.selector = (node) => node.componentName === selector
    }
    return buf.concat(behavior)
  }, [])
}

/**
* 通过组合多个来源创建资源。
*
* @param {IResourceCreator[]} sources - 通过创建方法生成的资源数组。
* @return {IResource[]} 创建的资源数组。
*/
export const createResource = (...sources: IResourceCreator[]): IResource[] => {
  return sources.reduce((buf, source) => {
    return buf.concat({
      ...source,
      node: new TreeNode({
        componentName: '$$ResourceNode$$',
        isSourceNode: true,
        children: source.elements || [],
        id: source.id,
      }),
    })
  }, [])
}

/**
 * 创建设计器
 *
 * @param {IEngineProps<Engine>} props - 设计器的属性
 * @returns {Engine} 生成的设计器
 */
export const createDesigner = (props: IEngineProps<Engine> = {}) => {
  const drivers = props.drivers || []
  const effects = props.effects || []
  const shortcuts = props.shortcuts || []
  return untracked(
    () =>
      new Engine({
        ...props,
        effects: [...effects, ...DEFAULT_EFFECTS],
        drivers: [...drivers, ...DEFAULT_DRIVERS],
        shortcuts: [...shortcuts, ...DEFAULT_SHORTCUTS],
      })
  )
}
