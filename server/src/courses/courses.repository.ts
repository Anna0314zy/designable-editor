import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts(params: { pageNo: number; pageSize: number; name?: string }) {
    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
      ...(params.name ? { name: { contains: params.name, mode: 'insensitive' } } : {}),
    }
    const [records, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip: (params.pageNo - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ])
    return { records, total }
  }

  findProduct(productId: string) {
    return this.prisma.course.findUnique({
      where: { id: productId },
      include: { lessons: { include: { slide: true }, orderBy: { serialNumber: 'asc' } } },
    })
  }

  async ensureProduct(productId: string) {
    return this.prisma.course.upsert({
      where: { id: productId },
      update: {},
      create: {
        id: productId,
        name: '本地联调示例课程',
        cityName: '北京',
        year: '2026',
        seasonName: '春季',
        gradeName: '一年级',
        subjectName: '数学',
        bookVersionName: '通用版',
        productTypeName: '系统课',
      },
    })
  }

  async ensureDefaultLessons(productId: string) {
    await this.ensureProduct(productId)
    await this.prisma.lessonBinding.upsert({
      where: { mainId_serialNumber: { mainId: productId, serialNumber: '1' } },
      update: {},
      create: { mainId: productId, serialNumber: '1', title: '第1讲' },
    })
    await this.prisma.lessonBinding.upsert({
      where: { mainId_serialNumber: { mainId: productId, serialNumber: '2' } },
      update: {},
      create: { mainId: productId, serialNumber: '2', title: '第2讲' },
    })
  }

  bindSlide(params: { mainId: string; serialNumber: string; slideId: string; slideTitle?: string }) {
    return this.prisma.lessonBinding.upsert({
      where: { mainId_serialNumber: { mainId: params.mainId, serialNumber: params.serialNumber } },
      update: { slideId: params.slideId, title: params.slideTitle },
      create: {
        mainId: params.mainId,
        serialNumber: params.serialNumber,
        slideId: params.slideId,
        title: params.slideTitle,
      },
      include: { slide: true },
    })
  }

  updateLessonInformation(params: { mainId: string; serialNumber: string; lessonInformation: string }) {
    return this.prisma.lessonBinding.upsert({
      where: { mainId_serialNumber: { mainId: params.mainId, serialNumber: params.serialNumber } },
      update: { lessonInformation: params.lessonInformation },
      create: params,
    })
  }
}
