import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { BaseDataController } from './base-data.controller'

@Module({
  imports: [AuthModule],
  controllers: [BaseDataController],
})
export class BaseDataModule {}
