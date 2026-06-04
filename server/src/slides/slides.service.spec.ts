import { NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { SlideStatus } from '@prisma/client'
import { SlidesRepository } from './slides.repository'
import { SlidesService } from './slides.service'

describe('SlidesService', () => {
  let service: SlidesService
  const repository = {
    createSlide: jest.fn(),
    findSlide: jest.fn(),
    updateSlideStructure: jest.fn(),
    setSlideStatus: jest.fn(),
    getNextPublishVersion: jest.fn(),
    createPublishRecord: jest.fn(),
    updatePagePublishScreenshot: jest.fn(),
    markPublishSuccess: jest.fn(),
    markPublishFailed: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    const moduleRef = await Test.createTestingModule({
      providers: [
        SlidesService,
        {
          provide: SlidesRepository,
          useValue: repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = moduleRef.get(SlidesService)
  })

  it('creates slide id response compatible with frontend', async () => {
    repository.createSlide.mockResolvedValue({ id: 'slide-id' })
    await expect(service.createSlide()).resolves.toEqual({ slideId: 'slide-id' })
  })

  it('throws when slide does not exist', async () => {
    repository.findSlide.mockResolvedValue(null)
    await expect(service.getSlide('missing')).rejects.toBeInstanceOf(NotFoundException)
  })

  it('publishes slide and returns publish record shape', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1780272000000)
    repository.findSlide.mockResolvedValue({
      id: 'slide-id',
      slideStructure: [{ id: 'page-id' }],
      pages: [
        {
          id: 'page-id',
          pageType: 1,
          sortIndex: 0,
          mainContentStructure: { id: 'page-id', pageInfo: { children: [] } },
          gameId: null,
          gameTemplateId: null,
          resourceRelations: [],
        },
      ],
    })
    repository.getNextPublishVersion.mockResolvedValue(1)
    repository.createPublishRecord.mockResolvedValue({
      id: 'publish-record-id',
      version: 1,
      slideSnapshot: [{ id: 'page-id' }],
      pages: [
        {
          id: 'page-snapshot-id',
          pageId: 'page-id',
          pageType: 1,
          sortIndex: 0,
          resources: [],
        },
      ],
    })
    repository.updatePagePublishScreenshot.mockResolvedValue({
      pageId: 'page-id',
      pageType: 1,
      sortIndex: 0,
      screenshotOssPath: '/slides/slide/slide-id/1/screenshots/page-id.png',
    })
    repository.markPublishSuccess.mockResolvedValue([])

    await expect(service.publish('slide-id')).resolves.toEqual({
      slideStatus: SlideStatus.published,
      lastSlidePublishRecordDto: { createTime: 1780272000000 },
      publishRecordId: 'publish-record-id',
      version: 1,
      manifestOssPath: '/slides/slide/slide-id/1/manifest.json',
      manifest: {
        slideId: 'slide-id',
        publishRecordId: 'publish-record-id',
        version: 1,
        schemaVersion: '1.0.0',
        slideSnapshot: [{ id: 'page-id' }],
        pages: [
          {
            pageId: 'page-id',
            pageType: 1,
            sortIndex: 0,
            pageJsonPath: '/slides/slide/slide-id/1/pages/page-id.json',
            screenshotOssPath: '/slides/slide/slide-id/1/screenshots/page-id.png',
          },
        ],
      },
    })
    jest.restoreAllMocks()
  })
})
