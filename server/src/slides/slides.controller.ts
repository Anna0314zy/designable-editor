import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreatePageDto, DeletePageDto, ExitEditDto, SavePageDto, SaveSlideDto, SaveTasksDto } from './dto/slides.dto'
import { SlidesService } from './slides.service'

@ApiBearerAuth()
@Controller('classroom-slides/slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('create')
  createSlide() {
    return this.slidesService.createSlide()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
  @Get('pages/course-tasks')
  getAllTasks(@Query('slideId') slideId: string, @Query('taskType') taskType?: string) {
    return this.slidesService.getTasks({ slideId, taskType })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/course-tasks/save')
  saveTasks(@Body() dto: SaveTasksDto) {
    return this.slidesService.saveTasks(dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/course-tasks/add')
  addTasks(@Body() dto: SaveTasksDto) {
    return this.slidesService.addTasks(dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/create')
  createPage(@Body() dto: CreatePageDto) {
    return this.slidesService.createPage(dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/delete')
  deletePage(@Body() dto: DeletePageDto) {
    return this.slidesService.deletePage(dto.pageId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/:pageId/save')
  savePage(@Param('pageId') pageId: string, @Body() dto: SavePageDto) {
    return this.slidesService.savePage(pageId, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
  @Get('pages/:pageId/course-tasks')
  getPageTasks(@Param('pageId') pageId: string) {
    return this.slidesService.getTasks({ pageId })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/:pageId/course-tasks/:elementId/edit')
  editTask(@Param('pageId') pageId: string, @Param('elementId') elementId: string, @Body() dto: SaveTasksDto) {
    return this.slidesService.editElementTasks(pageId, elementId, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post('pages/:pageId/course-tasks/:elementId/delete')
  removeTaskByPost(@Param('pageId') pageId: string, @Param('elementId') elementId: string) {
    return this.slidesService.deleteElementTasks(pageId, elementId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Delete('pages/:pageId/course-tasks/:elementId/delete')
  removeTaskByDelete(@Param('pageId') pageId: string, @Param('elementId') elementId: string) {
    return this.slidesService.deleteElementTasks(pageId, elementId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
  @Get(':slideId')
  getSlide(@Param('slideId') slideId: string) {
    return this.slidesService.getSlide(slideId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post(':slideId/save')
  saveSlide(@Param('slideId') slideId: string, @Body() dto: SaveSlideDto) {
    return this.slidesService.saveSlide(slideId, dto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post(':slideId/publish')
  publish(@Param('slideId') slideId: string) {
    return this.slidesService.publish(slideId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post(':slideId/cancel-publish')
  cancelPublish(@Param('slideId') slideId: string) {
    return this.slidesService.cancelPublish(slideId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.editor, UserRole.admin)
  @Post(':slideId/go-to-edit')
  goToEdit(@Param('slideId') slideId: string) {
    return this.slidesService.goToEdit(slideId)
  }

  @Post(':slideId/exit-edit')
  exitEdit(@Param('slideId') slideId: string, @Body() dto: ExitEditDto) {
    return this.slidesService.exitEdit(slideId, dto.lockToken)
  }
}
