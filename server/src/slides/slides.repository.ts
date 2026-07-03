import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma, PublishJobStatus, PublishStatus, SlideStatus } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SlidesRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSlide() {
    return this.prisma.slide.create({ data: {} })
  }

  findSlide(slideId: string) {
    return this.prisma.slide.findFirst({
      where: { id: slideId, deletedAt: null },
      include: {
        pages: {
          where: { deletedAt: null },
          orderBy: { sortIndex: 'asc' },
          include: {
            resourceRelations: {
              where: { deletedAt: null },
              include: { resource: true },
            },
          },
        },
      },
    })
  }

  updateSlideStructure(slideId: string, slideStructure: Prisma.InputJsonValue) {
    return this.prisma.slide.update({
      where: { id: slideId },
      data: { slideStructure },
    })
  }

  setSlideStatus(slideId: string, status: SlideStatus) {
    return this.prisma.slide.update({
      where: { id: slideId },
      data: {
        status,
        lastPublishedAt: status === SlideStatus.published ? new Date() : undefined,
      },
    })
  }

  async getNextPublishVersion(slideId: string, tx: Prisma.TransactionClient = this.prisma as unknown as Prisma.TransactionClient) {
    const lastRecord = await tx.slidePublishRecord.findFirst({
      where: { slideId },
      orderBy: { version: 'desc' },
      select: { version: true },
    })
    return (lastRecord?.version ?? 0) + 1
  }

  async createPublishRecord(params: {
    slideId: string
    slideSnapshot: Prisma.InputJsonValue
    pages: Array<{
      pageId: string
      pageType: number
      sortIndex: number
      pageSnapshot: Prisma.InputJsonValue
      resources: Prisma.InputJsonValue
    }>
  }) {
    const maxAttempts = 3
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await this.prisma.$transaction(
          async tx => {
            const lockResult = await tx.slide.updateMany({
              where: {
                id: params.slideId,
                deletedAt: null,
                status: { not: SlideStatus.publishing },
              },
              data: { status: SlideStatus.publishing },
            })
            if (!lockResult.count) throw new BadRequestException('课件正在发布中，请稍后重试')

            const version = await this.getNextPublishVersion(params.slideId, tx)
            const record = await tx.slidePublishRecord.create({
              data: {
                slideId: params.slideId,
                version,
                status: PublishStatus.publishing,
                slideSnapshot: params.slideSnapshot,
                pages: {
                  create: params.pages.map(page => ({
                    pageId: page.pageId,
                    pageType: page.pageType,
                    sortIndex: page.sortIndex,
                    pageSnapshot: page.pageSnapshot,
                    resources: page.resources,
                  })),
                },
              },
              include: {
                pages: {
                  orderBy: { sortIndex: 'asc' },
                },
              },
            })
            const job = await tx.publishJob.create({
              data: {
                slideId: params.slideId,
                publishRecordId: record.id,
              },
            })
            return { record, job }
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        )
      } catch (error) {
        if (attempt < maxAttempts && this.isRetryablePublishStartError(error)) continue
        throw error
      }
    }
    throw new BadRequestException('发布版本号生成失败，请重试')
  }

  private isRetryablePublishStartError(error: unknown) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false
    if (error.code === 'P2034') return true
    return (
      error.code === 'P2002' &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes('slideId') &&
      error.meta.target.includes('version')
    )
  }

  updatePagePublishScreenshot(pageSnapshotId: string, screenshotOssPath: string) {
    return this.prisma.pagePublishSnapshot.update({
      where: { id: pageSnapshotId },
      data: { screenshotOssPath },
    })
  }

  getPublishJob(jobId: string) {
    return this.prisma.publishJob.findUnique({
      where: { id: jobId },
      include: { publishRecord: true },
    })
  }

  async acquireNextPublishJob(params: { workerId: string; staleAfterMs: number }) {
    const now = new Date()
    const staleBefore = new Date(now.getTime() - params.staleAfterMs)
    const job = await this.prisma.publishJob.findFirst({
      where: {
        OR: [
          { status: PublishJobStatus.pending, nextRunAt: { lte: now } },
          { status: PublishJobStatus.running, lockedAt: { lt: staleBefore } },
        ],
      },
      orderBy: [{ nextRunAt: 'asc' }, { createdAt: 'asc' }],
    })
    if (!job) return null

    const result = await this.prisma.publishJob.updateMany({
      where: { id: job.id, updatedAt: job.updatedAt },
      data: {
        status: PublishJobStatus.running,
        attempts: { increment: 1 },
        lockedAt: now,
        lockedBy: params.workerId,
        errorMessage: null,
      },
    })
    if (!result.count) return null

    return this.prisma.publishJob.findUnique({ where: { id: job.id } })
  }

  markPublishJobSuccess(jobId: string) {
    return this.prisma.publishJob.update({
      where: { id: jobId },
      data: {
        status: PublishJobStatus.success,
        lockedAt: null,
        lockedBy: null,
        errorMessage: null,
      },
    })
  }

  markPublishJobRetry(params: { jobId: string; errorMessage: string; nextRunAt: Date }) {
    return this.prisma.publishJob.update({
      where: { id: params.jobId },
      data: {
        status: PublishJobStatus.pending,
        nextRunAt: params.nextRunAt,
        lockedAt: null,
        lockedBy: null,
        errorMessage: params.errorMessage,
      },
    })
  }

  markPublishJobFailed(params: { jobId: string; errorMessage: string }) {
    return this.prisma.publishJob.update({
      where: { id: params.jobId },
      data: {
        status: PublishJobStatus.failed,
        lockedAt: null,
        lockedBy: null,
        errorMessage: params.errorMessage,
      },
    })
  }

  async markPublishSuccess(params: {
    slideId: string
    publishRecordId: string
    manifest: Prisma.InputJsonValue
    manifestOssPath: string
    packageOssPath?: string
  }) {
    await this.prisma.$transaction(async tx => {
      const record = await tx.slidePublishRecord.updateMany({
        where: { id: params.publishRecordId, status: PublishStatus.publishing },
        data: {
          status: PublishStatus.success,
          manifest: params.manifest,
          manifestOssPath: params.manifestOssPath,
          packageOssPath: params.packageOssPath,
          errorMessage: null,
        },
      })
      if (!record.count) throw new BadRequestException('发布记录状态已变化，不能标记为成功')

      await tx.slide.update({
        where: { id: params.slideId },
        data: {
          status: SlideStatus.published,
          currentPublishId: params.publishRecordId,
          lastPublishedAt: new Date(),
        },
      })
    })
  }

  async markPublishFailed(params: { slideId: string; publishRecordId: string; errorMessage: string }) {
    await this.prisma.$transaction(async tx => {
      const record = await tx.slidePublishRecord.updateMany({
        where: { id: params.publishRecordId, status: PublishStatus.publishing },
        data: {
          status: PublishStatus.failed,
          errorMessage: params.errorMessage,
        },
      })
      if (!record.count) throw new BadRequestException('发布记录状态已变化，不能标记为失败')

      await tx.slide.update({
        where: { id: params.slideId },
        data: { status: SlideStatus.publish_failed },
      })
    })
  }

  getPublishRecord(publishRecordId: string) {
    return this.prisma.slidePublishRecord.findUnique({
      where: { id: publishRecordId },
      include: {
        pages: { orderBy: { sortIndex: 'asc' } },
      },
    })
  }

  getPublishRecords(slideId: string) {
    return this.prisma.slidePublishRecord.findMany({
      where: { slideId },
      orderBy: { version: 'desc' },
      include: {
        pages: { orderBy: { sortIndex: 'asc' } },
      },
    })
  }

  getCurrentPublishRecord(slideId: string) {
    // currentPublish 是挂在 Slide 上的“一条当前发布记录指针”，pages 又是这条发布记录下面的页面快照。
    return this.prisma.slide.findFirst({
      where: { id: slideId, deletedAt: null },
      include: {
        currentPublish: {
          include: {
            pages: { orderBy: { sortIndex: 'asc' } },
          },
        },
      },
    })
  }

  rollbackPublish(slideId: string, publishRecordId: string) {
    return this.prisma.$transaction(async tx => {
      const record = await tx.slidePublishRecord.findFirst({
        where: { id: publishRecordId, slideId, status: PublishStatus.success },
      })
      if (!record) return null
      await tx.slide.update({
        where: { id: slideId },
        data: {
          status: SlideStatus.published,
          currentPublishId: publishRecordId,
          lastPublishedAt: new Date(),
        },
      })
      return record
    })
  }

  setLock(slideId: string, locked: boolean, currentLockEmpName?: string, currentLockToken?: string) {
    return this.prisma.slide.update({
      where: { id: slideId },
      data: {
        currentLockEmpName: locked ? currentLockEmpName ?? '' : null,
        currentLockToken: locked ? currentLockToken ?? null : null,
      },
    })
  }

  releaseLock(slideId: string, lockToken: string) {
    return this.prisma.slide.updateMany({
      where: { id: slideId, currentLockToken: lockToken, deletedAt: null },
      data: {
        currentLockEmpName: null,
        currentLockToken: null,
      },
    })
  }

  createPage(data: { id: string; slideId: string; pageType: number; mainContentStructure: Prisma.InputJsonValue; sortIndex: number }) {
    return this.prisma.page.create({ data })
  }

  softDeletePage(pageId: string) {
    return this.prisma.page.update({
      where: { id: pageId },
      data: { deletedAt: new Date() },
    })
  }

  findPage(pageId: string) {
    return this.prisma.page.findFirst({ where: { id: pageId, deletedAt: null } })
  }

  savePage(
    pageId: string,
    data: { mainContentStructure: Prisma.InputJsonValue; fileMd5List?: string[]; gameId?: string; gameTemplateId?: string },
  ) {
//     update 用于更新一条唯一确定的数据，比如通过 pageId 更新 Page；updateMany 用于批量更新，比如把某个页面下所有旧资源关系先软删除。

// 保存页面资源时，我用了“先软删旧关系，再 upsert 新关系”的方式同步资源列表。upsert 的 update: { deletedAt: null } 是为了恢复之前被软删除的关系；如果关系不存在，就 create 新关系。整个过程放在事务里，保证页面内容和资源关系一致。
    return this.prisma.$transaction(async tx => {
      const page = await tx.page.update({
        where: { id: pageId },
        data: {
          mainContentStructure: data.mainContentStructure,
          gameId: data.gameId,
          gameTemplateId: data.gameTemplateId,
        },
      })

      if (data.fileMd5List) {
        await tx.pageResourceRelation.updateMany({
          where: { pageId, deletedAt: null },
          data: { deletedAt: new Date() },
        })
        const resources = await tx.resource.findMany({ where: { fileMd5: { in: data.fileMd5List }, deletedAt: null } })
        for (const resource of resources) {
          await tx.pageResourceRelation.upsert({
            where: { pageId_resourceId: { pageId, resourceId: resource.id } },
            update: { deletedAt: null },
            create: { pageId, resourceId: resource.id },
          })
        }
      }

      return page
    })
  }

  replaceTasks(params: { slideId: string; pageId: string; tasks: Array<Record<string, unknown>> }) {
    return this.prisma.$transaction(async tx => {
      await tx.courseTask.updateMany({
        where: { pageId: params.pageId, deletedAt: null },
        data: { deletedAt: new Date() },
      })
      return Promise.all(params.tasks.map((task, index) => this.upsertTask(tx, params.slideId, params.pageId, task, index)))
    })
  }

  appendTasks(params: { slideId: string; pageId: string; tasks: Array<Record<string, unknown>> }) {
    return this.prisma.$transaction(async tx => {
      const count = await tx.courseTask.count({ where: { pageId: params.pageId, deletedAt: null } })
      return Promise.all(params.tasks.map((task, index) => this.upsertTask(tx, params.slideId, params.pageId, task, count + index)))
    })
  }

  editElementTasks(params: { slideId: string; pageId: string; elementId: string; tasks: Array<Record<string, unknown>> }) {
    return this.prisma.$transaction(async tx => {
      await tx.courseTask.updateMany({
        where: { pageId: params.pageId, elementId: params.elementId, deletedAt: null },
        data: { deletedAt: new Date() },
      })
      return Promise.all(
        params.tasks.map((task, index) => this.upsertTask(tx, params.slideId, params.pageId, { ...task, elementId: params.elementId }, index)),
      )
    })
  }

  deleteElementTasks(pageId: string, elementId: string) {
    return this.prisma.courseTask.updateMany({
      where: { pageId, elementId, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }

  findTasks(params: { slideId?: string; pageId?: string; taskType?: string }) {
    return this.prisma.courseTask.findMany({
      where: {
        deletedAt: null,
        slideId: params.slideId,
        pageId: params.pageId,
        taskType: params.taskType || undefined,
      },
      orderBy: { sortIndex: 'asc' },
    })
  }

  private upsertTask(
    tx: Prisma.TransactionClient,
    slideId: string,
    pageId: string,
    task: Record<string, unknown>,
    index: number,
  ) {
    const id = typeof task.id === 'string' && this.isUuid(task.id) ? task.id : undefined
    const elementId = String(task.elementId ?? id ?? '')
    const taskType = task.taskType ? String(task.taskType) : undefined
    const sortIndex = Number(task.sortIndex ?? index)
    const payload = this.toJsonObject(task)
    return tx.courseTask.create({
      data: {
        id,
        slideId,
        pageId,
        elementId,
        taskType,
        sortIndex,
        taskExt: task.taskExt === undefined ? undefined : (this.toJsonValue(task.taskExt) as Prisma.InputJsonValue),
        payload,
      },
    })
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  }

  private toJsonObject(value: Record<string, unknown>): Prisma.InputJsonObject {
    return JSON.parse(
      JSON.stringify(value, (_key, item) => (item === undefined ? null : item)),
    ) as Prisma.InputJsonObject
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    if (value === undefined) return {}
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
  }
}
