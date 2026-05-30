/*
 * @Date: 2023-12-05 17:51:06
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-21 16:29:52
 * @FilePath: /slides-engine/packages/react/src/hooks/useGlobalData.ts
 */
import { useContextSelector } from 'use-context-selector'
import { GlobalDataContext, GlobalResourceContext } from '../globalDataContext'
export const useGlobalData = () => {
   return useContextSelector(GlobalDataContext, (v) => v.globalData)
}

export const useSetGlobalData = () => {
   return useContextSelector(GlobalDataContext, (v) => v.setGlobalData)
}

export const useResourceData = () => {
   return useContextSelector(GlobalResourceContext, (v) => v.globalResource)
}

export const useSetResourceData = () => {
   return useContextSelector(GlobalResourceContext, (v) => v.setGlobalResource)
}