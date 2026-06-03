import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { VersionsController } from './versions.controller'
import { VersionsRepository } from './versions.repository'
import { VersionsService } from './versions.service'

@Module({
  imports: [AuthModule],
  controllers: [VersionsController],
  providers: [VersionsService, VersionsRepository],
})
export class VersionsModule {}
