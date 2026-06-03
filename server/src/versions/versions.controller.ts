import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { VersionsService } from './versions.service'

class SaveVersionDto {
  @IsString()
  systemName: string

  @IsOptional()
  @IsString()
  version?: string
}

@Controller('classroom-slides/manage')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get(':systemName/current-version')
  getCurrentVersion(@Param('systemName') systemName: string) {
    return this.versionsService.getCurrentVersion(systemName)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post('system/version/save-or-update')
  saveVersion(@Body() dto: SaveVersionDto) {
    return this.versionsService.saveVersion(dto)
  }
}
