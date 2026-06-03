import { UserRole } from '@prisma/client'

export interface AuthUser {
  sub: string
  username: string
  roles: UserRole[]
}
