import { Injectable } from '@nestjs/common'
import { AddLessonInformationDto, BindSlideDto, CourseListDto } from './dto/course.dto'
import { CoursesRepository } from './courses.repository'

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  getProductAttributes() {
    return [
      { schoolId: '110000', schoolName: '北京', sortOrder: 1, standardId: '110000' },
      { schoolId: '310000', schoolName: '上海', sortOrder: 2, standardId: '310000' },
    ]
  }

  async findProductList(dto: CourseListDto) {
    const { records, total } = await this.coursesRepository.findProducts({
      pageNo: dto.pageNo,
      pageSize: dto.pageSize,
      name: dto.name?.replace(/\\t/g, '').trim(),
    })
    return { records, current: dto.pageNo, size: dto.pageSize, total }
  }

  getProductOutline() {
    return { noNameBeanList: [{ no: 1, name: '第1讲' }, { no: 2, name: '第2讲' }] }
  }

  async getSlideDetail(productId: string) {
    await this.coursesRepository.ensureDefaultLessons(productId)
    const product = await this.coursesRepository.findProduct(productId)
    return {
      bindSlideDtoList:
        product?.lessons.map(lesson => ({
          mainId: lesson.mainId,
          serialNumber: lesson.serialNumber,
          name: lesson.title || `第${lesson.serialNumber}讲`,
          title: lesson.title,
          lessonInformation: lesson.lessonInformation,
          slideId: lesson.slideId,
          slideContentDto: lesson.slide
            ? {
                slideStatus: lesson.slide.status,
                lastSlidePublishRecordDto: lesson.slide.lastPublishedAt
                  ? { createTime: lesson.slide.lastPublishedAt.getTime() }
                  : null,
              }
            : null,
        })) ?? [],
    }
  }

  addLessonInformation(dto: AddLessonInformationDto) {
    return this.coursesRepository.updateLessonInformation(dto)
  }

  async bindSlide(dto: BindSlideDto) {
    await this.coursesRepository.ensureProduct(dto.mainId)
    return this.coursesRepository.bindSlide(dto)
  }
}
