import { Injectable } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.user.findFirst({ where: { username, deletedAt: null } })
  }

  findById(id: string) {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null } })
  }

  create(data: { username: string; passwordHash: string; roles?: UserRole[] }) {
    return this.prisma.user.create({ data })
  }

  upsertSystemUser(username: string, passwordHash: string, roles: UserRole[]) {
    return this.prisma.user.upsert({
      where: { username },
      update: { roles },
      create: { username, passwordHash, roles },
    })
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data })
  }
}
