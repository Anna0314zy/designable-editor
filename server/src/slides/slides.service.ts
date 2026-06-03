import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { SlideStatus } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CreatePageDto, SavePageDto, SaveSlideDto, SaveTasksDto } from './dto/slides.dto'
import { SlidesRepository } from './slides.repository'

@Injectable()
export class SlidesService {
  constructor(private readonly slidesRepository: SlidesRepository) {}

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
    const parsed = this.parseJson(dto.slideStructure, [])
    await this.slidesRepository.updateSlideStructure(slideId, parsed)
    // return this.getSlide(slideId)
  }

  async publish(slideId: string) {
    const slide = await this.slidesRepository.setSlideStatus(slideId, SlideStatus.published)
    return this.toSlideStatus(slide)
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
      mainContentStructure: this.parseJson(dto.mainContentStructure, {}),
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

  private parseJson(text: string, fallback: unknown) {
    try {
      return JSON.parse(text)
    } catch {
      return fallback
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
