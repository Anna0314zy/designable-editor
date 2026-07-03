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

  it('creates publish job and returns publishing status', async () => {
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
    repository.createPublishRecord.mockResolvedValue({
      record: {
        id: 'publish-record-id',
        version: 1,
      },
      job: {
        id: 'publish-job-id',
        status: 'pending',
      },
    })

    await expect(service.publish('slide-id')).resolves.toEqual({
      slideStatus: SlideStatus.publishing,
      lastSlidePublishRecordDto: null,
      publishRecordId: 'publish-record-id',
      publishJobId: 'publish-job-id',
      publishJobStatus: 'pending',
      version: 1,
    })
  })
})
