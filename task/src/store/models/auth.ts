/*
 * @Date: 2024-01-05 20:27:50
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-23 20:11:22
 * @FilePath: /slides-engine/task/src/store/models/auth.ts
 */
import * as api from '@/api/models/auth'

import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { AuthSession, AuthUser, clearAuthSession, getAuthUser, getToken, setAuthSession } from '@/utils/auth'

export interface AuthState {
  accessToken: string
  user: AuthUser | null
}

export default createModel<RootModel>()({
  state: {
    accessToken: getToken() || '',
    user: getAuthUser(),
  } as AuthState,
  reducers: {
    setSession(state, session: AuthSession) {
      return {
        ...state,
        accessToken: session.accessToken,
        user: session.user,
      }
    },
    setUser(state, user: AuthUser) {
      return {
        ...state,
        user,
      }
    },
    clearSession(state) {
      return {
        ...state,
        accessToken: '',
        user: null,
      }
    },
  },
  effects: (dispatch) => ({
    async login(payload: api.AuthCredentials) {
      const session = await api.login(payload)
      console.log('session',session)
      setAuthSession(session)
      dispatch.auth.setSession(session)
      // 登录成功  需要跳转到
      return session
    },
    async register(payload: api.AuthCredentials) {
      const session = await api.register(payload)
      setAuthSession(session)
      dispatch.auth.setSession(session)
      return session
    },
    async fetchCurrentUser() {
      const user = await api.getCurrentUser()
      dispatch.auth.setUser(user)
      return user
    },
    async logout() {
      await api.logout().catch(() => undefined)
      clearAuthSession()
      dispatch.auth.clearSession()
    },
  }),
})
