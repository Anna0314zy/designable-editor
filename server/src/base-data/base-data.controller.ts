import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.viewer, UserRole.editor, UserRole.admin)
@Controller('classroom-slides/base-data')
export class BaseDataController {
  @Get('school/list')
  getSchools() {
    return [{ name: '本地学校', cityCode: '110000', simpleName: '本地' }]
  }

  @Get('year/list')
  getYears() {
    return [2024, 2025, 2026]
  }
}
