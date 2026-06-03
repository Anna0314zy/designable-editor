import { NotFoundException } from '@nestjs/common'
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
    const date = new Date('2026-06-02T00:00:00.000Z')
    repository.setSlideStatus.mockResolvedValue({ status: SlideStatus.published, lastPublishedAt: date })
    await expect(service.publish('slide-id')).resolves.toEqual({
      slideStatus: SlideStatus.published,
      lastSlidePublishRecordDto: { createTime: date.getTime() },
    })
  })
})
