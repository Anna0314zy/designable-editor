import { each } from '@editor/shared'
import { Path } from '@slides/path'
import { observable } from '@slides/reactive'
import {
  IDesignerBehaviorStore,
  IDesignerIconsStore,
  IDesignerLocaleStore,
  IDesignerLanguageStore,
  IDesignerBehaviors,
  IDesignerLocales,
  IDesignerIcons,
  IBehaviorLike,
  IBehavior,
} from './types'
import { mergeLocales, lowerSnake, getBrowserLanguage } from './internals'
import { isBehaviorHost, isBehaviorList } from './externals'
import { TreeNode } from './models'

const getISOCode = (language: string) => {
  let isoCode = DESIGNER_LANGUAGE_STORE.value
  let lang = lowerSnake(language)
  if (DESIGNER_LOCALES_STORE.value[lang]) {
    return lang
  }
  each(DESIGNER_LOCALES_STORE.value, (_, key: string) => {
    if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
      isoCode = key
      return false
    }
  })
  return isoCode
}

const reSortBehaviors = (target: IBehavior[], sources: IDesignerBehaviors) => {
  const findTargetBehavior = (behavior: IBehavior) => target.includes(behavior)
  const findSourceBehavior = (name: string) => {
    for (let key in sources) {
      const { Behavior } = sources[key]
      for (let i = 0; i < Behavior.length; i++) {
        if (Behavior[i].name === name) return Behavior[i]
      }
    }
  }
  each(sources, (item) => {
    if (!item) return
    if (!isBehaviorHost(item)) return
    const { Behavior } = item
    each(Behavior, (behavior) => {
      if (findTargetBehavior(behavior)) return
      const name = behavior.name
      each(behavior.extends, (dep) => {
        const behavior = findSourceBehavior(dep)
        if (!behavior)
          throw new Error(`No ${dep} behavior that ${name} depends on`)
        if (!findTargetBehavior(behavior)) {
          target.unshift(behavior)
        }
      })
      target.push(behavior)
    })
  })
}

const DESIGNER_BEHAVIORS_STORE: IDesignerBehaviorStore = observable.ref([])

const DESIGNER_ICONS_STORE: IDesignerIconsStore = observable.ref({})

const DESIGNER_LOCALES_STORE: IDesignerLocaleStore = observable.ref({})

const DESIGNER_LANGUAGE_STORE: IDesignerLanguageStore = observable.ref(
  getBrowserLanguage()
)


const DESIGNER_GlobalRegistry = {
  /**
   * 设置设计器语言。
   *
   * @param {string} lang - 语言。
   */
  setDesignerLanguage: (lang: string) => {
    DESIGNER_LANGUAGE_STORE.value = lang
  },
  /**
   * 设置设计器行为为提供的行为数组。
   *
   * @param {IBehaviorLike[]} behaviors - 要设置的行为数组。
   * @return {void}
   */
  setDesignerBehaviors: (behaviors: IBehaviorLike[]) => {
    DESIGNER_BEHAVIORS_STORE.value = behaviors.reduce<IBehavior[]>(
      (buf, behavior) => {
        if (isBehaviorHost(behavior)) {
          return buf.concat(behavior.Behavior)
        } else if (isBehaviorList(behavior)) {
          return buf.concat(behavior)
        }
        return buf
      },
      []
    )
  },
  /**
   * 获取给定节点的设计器行为。
   *
   * @param {TreeNode} node - 要获取设计器行为的节点。
   * @return {Array} - 匹配给定节点的设计器行为数组。
   */
  getDesignerBehaviors: (node: TreeNode) => {
    return DESIGNER_BEHAVIORS_STORE.value.filter((pattern) =>
      pattern.selector(node)
    )
  },
  /**
   * 根据给定的名称获取设计器图标。
   *
   * @param {string} name - 设计器图标的名称。
   * @return {any} 设计器图标对象。
   */
  getDesignerIcon: (name: string) => {
    return DESIGNER_ICONS_STORE[name]
  },
  /**
   * 获取设计器的语言。
   *
   * @return {string} ISO 代码。
   */
  getDesignerLanguage: () => {
    return getISOCode(DESIGNER_LANGUAGE_STORE.value)
  },
  /**
   * 获取给定令牌的设计器消息。
   *
   * @param {string} token - 用于标识设计器消息的令牌。
   * @param {IDesignerLocales} [locales] - 可选的包含设计器区域设置的区域设置对象。
   * @returns {string | undefined} 与令牌对应的设计器消息，如果找不到则返回undefined。
   */
  getDesignerMessage: (token: string, locales?: IDesignerLocales) => {
    const lang = getISOCode(DESIGNER_LANGUAGE_STORE.value)
    const locale = locales ? locales[lang] : DESIGNER_LOCALES_STORE.value[lang]
    if (!locale) {
      for (let key in DESIGNER_LOCALES_STORE.value) {
        const message = Path.getIn(
          DESIGNER_LOCALES_STORE.value[key],
          lowerSnake(token)
        )
        if (message) return message
      }
      return
    }
    return Path.getIn(locale, lowerSnake(token))
  },
  /**
   * 注册设计器。
   *
   * @param {IDesignerIcons} map - 要注册的设计器图标映射。
   */
  registerDesignerIcons: (map: IDesignerIcons) => {
    Object.assign(DESIGNER_ICONS_STORE, map)
  },
  /**
   * 注册设计器本地化信息。
   *
   * @param {IDesignerLocales[]} packages - 要注册的包。
   */
  registerDesignerLocales: (...packages: IDesignerLocales[]) => {
    packages.forEach((locales) => {
      mergeLocales(DESIGNER_LOCALES_STORE.value, locales)
    })
  },
  /**
   * 从提供的包中注册设计器行为。
   *
   * @param {...IDesignerBehaviors[]} packages - 包含要注册的设计器行为的包。
   * @return {void} - 不返回任何值。
   */
  registerDesignerBehaviors: (...packages: IDesignerBehaviors[]) => {
    const results: IBehavior[] = []
    packages.forEach((sources) => {
      reSortBehaviors(results, sources)
    })
    if (results.length) {
      DESIGNER_BEHAVIORS_STORE.value = results
    }
  },
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry = DESIGNER_GlobalRegistry
