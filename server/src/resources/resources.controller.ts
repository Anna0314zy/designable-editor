import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CreateResourceDto, ResourceRelationDto } from './dto/resource.dto'
import { ResourcesService } from './resources.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
@Controller('classroom-slides')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
  @Get('resources/cos/config')
  getCosConfig() {
    return this.resourcesService.getCosConfig()
  }

  @Roles(UserRole.editor, UserRole.admin)
  @Get('resources/cos/credential')
  getCredential(@Query('bucketName') bucketName?: string) {
    return this.resourcesService.getCredential(bucketName)
  }

  @Get('resources/:fileMd5')
  findByMd5(@Param('fileMd5') fileMd5: string) {
    return this.resourcesService.findByMd5(fileMd5)
  }

  @Roles(UserRole.editor, UserRole.admin)
  @Post('resources/create')
  create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto)
  }

  @Roles(UserRole.editor, UserRole.admin)
  @Post('slides/pages/resource-relation/save')
  addRelation(@Body() dto: ResourceRelationDto) {
    return this.resourcesService.addRelation(dto)
  }

  @Roles(UserRole.editor, UserRole.admin)
  @Post('slides/pages/resource-relation/delete')
  removeRelation(@Body() dto: ResourceRelationDto) {
    return this.resourcesService.removeRelation(dto)
  }
}
