import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class VersionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrent(systemName: string) {
    return this.prisma.systemVersion.findUnique({ where: { systemName } })
  }

  save(systemName: string, version: string) {
    return this.prisma.systemVersion.upsert({
      where: { systemName },
      update: { version },
      create: { systemName, version },
    })
  }
}
