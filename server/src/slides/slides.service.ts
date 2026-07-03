import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, SlideStatus } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CreatePageDto, SavePageDto, SaveSlideDto, SaveTasksDto } from './dto/slides.dto'
import { SlidesRepository } from './slides.repository'

@Injectable()
export class SlidesService {
  constructor(
    private readonly slidesRepository: SlidesRepository,
    private readonly config: ConfigService,
  ) {}

  async createSlide() {
    const slide = await this.slidesRepository.createSlide()
    return { slideId: slide.id }
  }

  async getSlide(slideId: string) {
    const slide = await this.slidesRepository.findSlide(slideId)
    if (!slide) throw new NotFoundException('课件不存在')
    return this.toSlideResponse(slide)
  }

  async saveSlide(slideId: string, dto: SaveSlideDto) {
    const parsed = this.parseJson(dto.slideStructure, 'slideStructure')
    await this.slidesRepository.updateSlideStructure(slideId, parsed)
    // return this.getSlide(slideId)
  }

  async publish(slideId: string) {
    const slide = await this.slidesRepository.findSlide(slideId)
    if (!slide) throw new NotFoundException('课件不存在')
    if (!slide.pages.length) throw new BadRequestException('课件没有页面，不能发布')

    const { record, job } = await this.slidesRepository.createPublishRecord({
      slideId,
      slideSnapshot: this.toJsonValue(slide.slideStructure ?? []),
      pages: slide.pages.map(page => ({
        pageId: page.id,
        pageType: page.pageType,
        sortIndex: page.sortIndex,
        pageSnapshot: this.toJsonValue(page.mainContentStructure),
        resources: this.toJsonValue(this.getPageResourceSnapshots(page)),
      })),
    })

    return {
      slideStatus: SlideStatus.publishing,
      lastSlidePublishRecordDto: null,
      publishRecordId: record.id,
      publishJobId: job.id,
      publishJobStatus: job.status,
      version: record.version,
    }
  }

  async getPublishJob(jobId: string) {
    const job = await this.slidesRepository.getPublishJob(jobId)
    if (!job) throw new NotFoundException('发布任务不存在')
    return {
      publishJobId: job.id,
      publishRecordId: job.publishRecordId,
      slideId: job.slideId,
      version: job.publishRecord.version,
      status: job.status,
      attempts: job.attempts,
      maxAttempts: job.maxAttempts,
      nextRunAt: job.nextRunAt.getTime(),
      errorMessage: job.errorMessage,
      createTime: job.createdAt.getTime(),
    }
  }

  async executePublishJob(job: NonNullable<Awaited<ReturnType<SlidesRepository['acquireNextPublishJob']>>>) {
    const record = await this.slidesRepository.getPublishRecord(job.publishRecordId)
    if (!record) throw new NotFoundException('发布记录不存在')

    this.validatePublishResources(record.pages)

    const pages = []
    for (const page of record.pages) {
      const screenshotOssPath = await this.capturePageScreenshot({
        slideId: record.slideId,
        version: record.version,
        pageId: page.pageId,
        pageSnapshotId: page.id,
        pageSnapshot: page.pageSnapshot,
        resources: page.resources,
      })
      const updated = await this.slidesRepository.updatePagePublishScreenshot(page.id, screenshotOssPath)
      pages.push(updated)
    }

    const manifest = this.createManifest({
      slideId: record.slideId,
      publishRecordId: record.id,
      version: record.version,
      slideSnapshot: record.slideSnapshot,
      pages,
    })
    const manifestOssPath = `/slides/slide/${record.slideId}/${record.version}/manifest.json`

    await this.slidesRepository.markPublishSuccess({
      slideId: record.slideId,
      publishRecordId: record.id,
      manifest: this.toJsonValue(manifest),
      manifestOssPath,
    })

    return {
      publishRecordId: record.id,
      version: record.version,
      manifestOssPath,
      manifest,
    }
  }

  async cancelPublish(slideId: string) {
    const slide = await this.slidesRepository.setSlideStatus(slideId, SlideStatus.editing)
    return this.toSlideStatus(slide)
  }

  async goToEdit(slideId: string) {
    const lockToken = randomUUID()
    await this.slidesRepository.setLock(slideId, true, '', lockToken)
    return { lockedFlag: true, currentLockEmpName: '', lockToken }
  }

  async exitEdit(slideId: string, lockToken: string) {
    const result = await this.slidesRepository.releaseLock(slideId, lockToken)
    if (!result.count) throw new ForbiddenException('锁令牌无效')
    return { lockedFlag: false }
  }

  async createPage(dto: CreatePageDto) {
    const slide = await this.slidesRepository.findSlide(dto.slideId)
    if (!slide) throw new NotFoundException('课件不存在')
    const pageId = randomUUID()
    const page = await this.slidesRepository.createPage({
      id: pageId,
      slideId: dto.slideId,
      pageType: dto.pageType,
      sortIndex: slide.pages.length,
      mainContentStructure: this.createDefaultPage(pageId, dto.pageType),
    })
    return { pageId: page.id }
  }

  async deletePage(pageId: string) {
    await this.slidesRepository.softDeletePage(pageId)
    return { pageId }
  }

  async savePage(pageId: string, dto: SavePageDto) {
    await this.slidesRepository.savePage(pageId, {
      mainContentStructure: this.parseJson(dto.mainContentStructure, 'mainContentStructure'),
      fileMd5List: dto.fileMd5List,
      gameId: dto.gameId,
      gameTemplateId: dto.gameTemplateId,
    })
    return { pageId }
  }

  async saveTasks(dto: SaveTasksDto) {
    const tasks = await this.slidesRepository.replaceTasks({ slideId: dto.slideId, pageId: dto.pageId, tasks: dto.courseTaskList })
    return { courseTaskList: tasks.map(task => task.payload) }
  }

  async addTasks(dto: SaveTasksDto) {
    const tasks = await this.slidesRepository.appendTasks({ slideId: dto.slideId, pageId: dto.pageId, tasks: dto.courseTaskList })
    return { courseTaskList: tasks.map(task => task.payload) }
  }

  async getTasks(params: { slideId?: string; pageId?: string; taskType?: string }) {
    const tasks = await this.slidesRepository.findTasks(params)
    return { courseTaskList: tasks.map(task => ({ ...(task.payload as Record<string, unknown>), taskExt: task.taskExt })) }
  }

  async editElementTasks(pageId: string, elementId: string, dto: SaveTasksDto) {
    const tasks = await this.slidesRepository.editElementTasks({
      slideId: dto.slideId,
      pageId,
      elementId,
      tasks: dto.courseTaskList,
    })
    return { courseTaskList: tasks.map(task => task.payload) }
  }

  async deleteElementTasks(pageId: string, elementId: string) {
    await this.slidesRepository.deleteElementTasks(pageId, elementId)
    return { pageId, elementId }
  }

  async getPublishRecords(slideId: string) {
    return {
      publishRecordDtoList: (await this.slidesRepository.getPublishRecords(slideId)).map(record => this.toPublishRecordResponse(record)),
    }
  }

  async getLastSuccessPublishRecord(slideId: string) {
    const slide = await this.slidesRepository.getCurrentPublishRecord(slideId)
    if (!slide) throw new NotFoundException('课件不存在')
    if (!slide.currentPublish) throw new NotFoundException('暂无成功发布记录')
    return this.toPublishRecordResponse(slide.currentPublish)
  }

  async rollback(slideId: string, publishRecordId: string) {
    const record = await this.slidesRepository.rollbackPublish(slideId, publishRecordId)
    if (!record) throw new BadRequestException('只能回滚到当前课件的成功发布版本')
    return {
      slideStatus: SlideStatus.published,
      publishRecordId: record.id,
      version: record.version,
    }
  }

  private toSlideResponse(slide: Awaited<ReturnType<SlidesRepository['findSlide']>>) {
    if (!slide) throw new NotFoundException('课件不存在')
    return {
      slideId: slide.id,
      slideStructure: JSON.stringify(slide.slideStructure ?? []),
      slideStatus: slide.status,
      pageContentDtoList: slide.pages.map(page => ({
        pageId: page.id,
        pageType: page.pageType,
        mainContentStructure: JSON.stringify(page.mainContentStructure),
        fileResourceDtoList: page.resourceRelations.map(relation => relation.resource),
      })),
    }
  }

  private toSlideStatus(slide: { status: SlideStatus; lastPublishedAt: Date | null }) {
    return {
      slideStatus: slide.status,
      lastSlidePublishRecordDto: slide.lastPublishedAt ? { createTime: slide.lastPublishedAt.getTime() } : null,
    }
  }

  private toPublishRecordResponse(record: Awaited<ReturnType<SlidesRepository['getPublishRecord']>>) {
    if (!record) throw new NotFoundException('发布记录不存在')
    return {
      publishRecordId: record.id,
      slideId: record.slideId,
      version: record.version,
      status: record.status,
      manifest: record.manifest,
      manifestOssPath: record.manifestOssPath,
      packageOssPath: record.packageOssPath,
      errorMessage: record.errorMessage,
      createTime: record.createdAt.getTime(),
      pageSnapshotDtoList: record.pages.map(page => ({
        pageSnapshotId: page.id,
        pageId: page.pageId,
        pageType: page.pageType,
        sortIndex: page.sortIndex,
        pageSnapshot: JSON.stringify(page.pageSnapshot),
        screenshotOssPath: page.screenshotOssPath,
        resources: page.resources,
      })),
    }
  }

  private getPageResourceSnapshots(page: NonNullable<Awaited<ReturnType<SlidesRepository['findSlide']>>>['pages'][number]) {
    const resources = page.resourceRelations
      .map(relation => relation.resource)
      .filter(resource => !resource.deletedAt)
      .map(resource => ({
        resourceId: resource.id,
        fileMd5: resource.fileMd5,
        cosFullPath: resource.cosFullPath,
        fileName: resource.fileName,
        fileSize: resource.fileSize,
        resourceType: resource.resourceType,
        resourceFormat: resource.resourceFormat,
        fileType: resource.fileType,
        width: resource.width,
        height: resource.height,
      }))
    if (page.gameId || page.gameTemplateId) {
      resources.push({
        resourceId: '',
        fileMd5: '',
        cosFullPath: '',
        fileName: page.gameId ?? page.gameTemplateId ?? '',
        fileSize: 0,
        resourceType: 'game',
        resourceFormat: null,
        fileType: null,
        width: null,
        height: null,
      })
    }
    return resources
  }
// 发布时从 pageSnapshot/mainContentStructure 里解析真实引用到的 fileMd5
// 服务端拿这些 md5 去 resource 表查
// 对比缺失的 md5，直接报“第 N 页资源不存在/未上传”
// 如果还要严格确认 COS 文件存在，再对 cosFullPath 做 HEAD/Object existence 检查，不过这个成本更高，通常发布前查资源表就够了
  private validatePublishResources(pages: Array<{ sortIndex: number; resources: Prisma.JsonValue }>) {
    for (const page of pages) {
      const resources = Array.isArray(page.resources) ? page.resources : []
      for (const item of resources) {
        if (!item || typeof item !== 'object') continue
        const resource = item as Record<string, unknown>
        const resourceType = String(resource.resourceType ?? '')
        if (resourceType === 'game') continue
        if (!resource.fileMd5) throw new BadRequestException(`第 ${page.sortIndex + 1} 页存在未绑定的资源`)
        if (!resource.cosFullPath) throw new BadRequestException(`第 ${page.sortIndex + 1} 页资源未上传：${resource.fileMd5}`)
      }
    }
  }

  private async capturePageScreenshot(params: {
    slideId: string
    version: number
    pageId: string
    pageSnapshotId: string
    pageSnapshot: Prisma.JsonValue
    resources: Prisma.JsonValue
  }) {
    const screenshotServiceUrl = this.config.get<string>('SCREENSHOT_SERVICE_URL')

    console.log('screenshotServiceUrl',screenshotServiceUrl,JSON.stringify(params.pageSnapshot))
    console.log('---fileResourceDtoList-----',)
    console.log(';fileResourceDtoList',JSON.stringify(Array.isArray(params.resources) ? params.resources : []))
    if (screenshotServiceUrl) {
      const response = await fetch(screenshotServiceUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          pagesnapshotid: params.pageSnapshotId,
        },
        body: JSON.stringify({
          mainContentStructure: params.pageSnapshot,
          fileResourceDtoList: Array.isArray(params.resources) ? params.resources : [],
        }),
        signal: AbortSignal.timeout(this.config.get<number>('SCREENSHOT_TIMEOUT_MS', 60_000)),
      })

      console.log('http://127.0.0.1:8000',response)

      const text = await response.text()
      let result: Record<string, unknown> = {}
      try {
        result = text ? JSON.parse(text) : {}
      } catch {
        throw new BadRequestException(`截图服务返回非 JSON：${text}`)
      }

      if (!response.ok || result.success === false) {
        throw new BadRequestException(`截图失败：${String(result.message ?? text ?? response.statusText)}`)
      }

      const screenshotOssPath = result.screenshotOssPath
      if (typeof screenshotOssPath !== 'string' || !screenshotOssPath) {
        throw new BadRequestException('截图服务未返回 screenshotOssPath')
      }
      return screenshotOssPath
    }

    return `/slides/slide/${params.slideId}/${params.version}/screenshots/${params.pageId}.png`
  }

  private createManifest(params: {
    slideId: string
    publishRecordId: string
    version: number
    slideSnapshot: Prisma.JsonValue
    pages: Array<{ pageId: string; pageType: number; sortIndex: number; screenshotOssPath: string | null }>
  }) {
    return {
      slideId: params.slideId,
      publishRecordId: params.publishRecordId,
      version: params.version,
      schemaVersion: '1.0.0',
      slideSnapshot: params.slideSnapshot,
      pages: params.pages.map(page => ({
        pageId: page.pageId,
        pageType: page.pageType,
        sortIndex: page.sortIndex,
        pageJsonPath: `/slides/slide/${params.slideId}/${params.version}/pages/${page.pageId}.json`,
        screenshotOssPath: page.screenshotOssPath,
      })),
    }
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value, (_key, item) => (item === undefined ? null : item))) as Prisma.InputJsonValue
  }

  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error)
  }

  private parseJson(text: string, fieldName: string) {
    try {
      return JSON.parse(text)
    } catch (error) {
      throw new BadRequestException(`${fieldName} 不是合法 JSON：${this.getErrorMessage(error)}`)
    }
  }

  private createDefaultPage(pageId: string, pageType: number) {
    return {
      id: pageId,
      pageType,
      pageInfo: {
        children: [],
        componentName: 'Root',
        hidden: false,
        id: pageId,
        props: {
          info: { name: '课件页', type: '课件页' },
          style: {},
          animates: [],
        },
        sourceName: '',
      },
    }
  }
}
