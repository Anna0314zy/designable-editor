export interface AuthUser {
  id: string
  username: string
  roles: string[]
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

let accessToken: string | null = null
let authUser: AuthUser | null = null

export const LoginUrl = '/login'

export const getToken = () => accessToken

export const getAuthUser = () => authUser

export const setAuthSession = (session: AuthSession) => {
  accessToken = session.accessToken
  authUser = session.user
}

export const clearAuthSession = () => {
  accessToken = null
  authUser = null
}

export const isAuthenticated = () => Boolean(getToken())
