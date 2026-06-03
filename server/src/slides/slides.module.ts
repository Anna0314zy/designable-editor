import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { SlidesController } from './slides.controller'
import { SlidesRepository } from './slides.repository'
import { SlidesService } from './slides.service'

@Module({
  imports: [AuthModule],
  controllers: [SlidesController],
  providers: [SlidesService, SlidesRepository],
  exports: [SlidesService],
})
export class SlidesModule {}
