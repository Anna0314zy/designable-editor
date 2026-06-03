import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CoursesService } from './courses.service'
import { AddLessonInformationDto, BindSlideDto, CourseListDto, ProductAttributesDto } from './dto/course.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
@Controller('classroom-slides')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('forward/bedrock-course/pyProduct/findProductAttributes')
  getProductAttributes(@Body() _dto: ProductAttributesDto) {
    return this.coursesService.getProductAttributes()
  }

  @Post('forward/bedrock-course/pyProduct/findProductList')
  findProductList(@Body() dto: CourseListDto) {
    return this.coursesService.findProductList(dto)
  }

  @Get('forward/bedrock-course/pyProductOutline/findProductOutline')
  getProductOutline(@Query('productId') _productId: string) {
    return this.coursesService.getProductOutline()
  }

  @Get('lesson-packages/:productId')
  getSlideDetail(@Param('productId') productId: string) {
    return this.coursesService.getSlideDetail(productId)
  }

  @Roles(UserRole.editor, UserRole.admin)
  @Post('lesson-packages/lesson-information/add')
  addLessonInformation(@Body() dto: AddLessonInformationDto) {
    return this.coursesService.addLessonInformation(dto)
  }

  @Roles(UserRole.editor, UserRole.admin)
  @Post('lesson-packages/bind-slide')
  bindSlide(@Body() dto: BindSlideDto) {
    return this.coursesService.bindSlide(dto)
  }
}
