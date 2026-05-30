import { each, isPlainObj } from '@editor/shared'
import { globalThisPolyfill } from '@editor/shared'

/**
 * 将字符串转换为小写下划线格式。
 *
 * @param {string} str - 要转换的字符串。
 * @return {string} 转换后的小写下划线格式字符串。
 */
export const lowerSnake = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase()
}

/**
 * 递归地合并目标对象和源对象的本地化信息。
 *
 * @param {any} target - 要合并本地化信息的目标对象。
 * @param {any} source - 包含要合并的本地化信息的源对象。
 * @return {any} 合并后的对象，包含合并后的本地化信息。
 */
export const mergeLocales = (target: any, source: any) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, function (value, key) {
      const token = lowerSnake(key)
      const messages = mergeLocales(target[key] || target[token], value)
      target[token] = messages
    })
    return target
  } else if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {}
    each(source, function (value, key) {
      const messages = mergeLocales(undefined, value)
      result[lowerSnake(key)] = messages
    })
    return result
  }
  return source
}

/**
 * 返回浏览器的语言。代码覆盖率检测工具Istanbul会忽略istanbul ignore next这个注释下的代码
 *
 * @return {string} 浏览器的语言。
 */
export const getBrowserLanguage = () => {
  /* istanbul ignore next */
  if (!globalThisPolyfill.navigator) {
    return 'en'
  }
  return (
    globalThisPolyfill.navigator['browserlanguage'] ||
    globalThisPolyfill.navigator?.language ||
    'en'
  )
}
