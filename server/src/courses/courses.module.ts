import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoursesController } from './courses.controller'
import { CoursesRepository } from './courses.repository'
import { CoursesService } from './courses.service'
// 这段意思是：

// CoursesController：注册课程相关接口
// CoursesService：注册课程业务逻辑
// CoursesRepository：注册课程数据库访问逻辑
// HTTP 请求
//   ↓
// CoursesController
//   ↓
// CoursesService
//   ↓
// CoursesRepository
//   ↓
// PrismaService
//   ↓
// 数据库
@Module({
  imports: [AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
