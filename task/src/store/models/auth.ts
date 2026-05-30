/*
 * @Date: 2024-01-05 20:27:50
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-23 20:11:22
 * @FilePath: /slides-engine/task/src/store/models/auth.ts
 */
import * as api from '@/api/models/auth'

import { createModel } from '@rematch/core'
import { RootModel } from '.'

export interface AuthState {
  sysToken: string
}

export default createModel<RootModel>()({
  state: {
    sysToken: ''
  } as AuthState,
  reducers: {
    setSysToken(state, sysToken: string) {
      return {
        ...state,
        sysToken,
      }
    },
    updateSysToken(state, sysToken: string) {
        return {
            ...state,
            sysToken,
        }
    }
  },
  effects: (dispatch) => ({
    async login() {
      const systemToken = localStorage.getItem('systemToken')
      if(systemToken) {
        await dispatch.auth.setSysToken(systemToken)
        await api.login({systemToken})
      }
    },
    async checkLogin() {
      const systemToken = localStorage.getItem('systemToken')
      if(systemToken) {
        await dispatch.auth.setSysToken(systemToken)
        const res = await api.checkLogin({systemToken})
        if(res.systemToken) {
            await dispatch.auth.updateSysToken(res.systemToken)
            localStorage.setItem('systemToken', res.systemToken)
        }
      }
    }
  }),
})
