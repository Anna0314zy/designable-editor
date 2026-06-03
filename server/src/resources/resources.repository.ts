import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateResourceDto } from './dto/resource.dto'

@Injectable()
export class ResourcesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByMd5(fileMd5: string) {
    return this.prisma.resource.findFirst({ where: { fileMd5, deletedAt: null } })
  }

  create(dto: CreateResourceDto) {
    const data = {
      cosFullPath: dto.cosFullPath,
      fileMd5: dto.fileMd5,
      fileName: dto.fileName,
      fileSize: dto.fileSize,
      resourceType: dto.resourceType,
      resourceFormat: dto.resourceFormat,
      fileType: dto.fileType,
      width: dto.width,
      height: dto.height,
    }
    return this.prisma.resource.upsert({
      where: { fileMd5: dto.fileMd5 },
      update: { ...data, deletedAt: null },
      create: data,
    })
  }

  async addRelation(pageId: string, fileMd5: string) {
    const resource = await this.findByMd5(fileMd5)
    if (!resource) return null
    return this.prisma.pageResourceRelation.upsert({
      where: { pageId_resourceId: { pageId, resourceId: resource.id } },
      update: { deletedAt: null },
      create: { pageId, resourceId: resource.id },
    })
  }

  async removeRelation(pageId: string, fileMd5: string) {
    const resource = await this.findByMd5(fileMd5)
    if (!resource) return null
    return this.prisma.pageResourceRelation.updateMany({
      where: { pageId, resourceId: resource.id, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }
}
