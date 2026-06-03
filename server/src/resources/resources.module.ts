import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ResourcesController } from './resources.controller'
import { ResourcesRepository } from './resources.repository'
import { ResourcesService } from './resources.service'

@Module({
  imports: [AuthModule],
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourcesRepository],
})
export class ResourcesModule {}
