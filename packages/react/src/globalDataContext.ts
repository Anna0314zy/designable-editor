/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-21 16:27:24
 * @FilePath: /slides-engine/packages/react/src/globalDataContext.ts
 */
import {createContext} from 'use-context-selector'
import {IGlobalDataContext, IGlobalResourceContext} from './types'
/**
 * 全局数据
 */
export const GlobalDataContext = createContext<IGlobalDataContext>(null)
export const GlobalResourceContext = createContext<IGlobalResourceContext>(null)