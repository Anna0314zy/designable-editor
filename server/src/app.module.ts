import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { BaseDataModule } from './base-data/base-data.module'
import { CommonModule } from './common/common.module'
// import { CoursesModule } from './courses/courses.module'
import { PrismaModule } from './prisma/prisma.module'
import { ResourcesModule } from './resources/resources.module'
import { SlidesModule } from './slides/slides.module'
import { VersionsModule } from './versions/versions.module'
import { validateEnv } from './config/env.validation'
// AppModule
//   ├─ ConfigModule       配置模块，读取/校验环境变量
//   ├─ CommonModule       公共模块，目前代码里是空的
//   ├─ PrismaModule       数据库模块，提供 PrismaService
//   ├─ AuthModule         登录、鉴权、角色守卫
//   ├─ VersionsModule     版本相关接口
//   ├─ BaseDataModule     基础数据接口，比如学校列表、年份列表
//   ├─ CoursesModule      课程/课包相关接口
//   ├─ SlidesModule       课件/幻灯片相关接口
//   └─ ResourcesModule    资源文件相关接口
// 业务模块之间通常没顺序要求
// 有依赖关系时，要通过 imports/exports 表达依赖，不是靠数组顺序
// ConfigModule、PrismaModule 这种基础能力模块通常习惯放前面
// 请求怎么走，看的是 Controller 路由，不是 imports 顺序
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CommonModule,
    PrismaModule,
    AuthModule,
    VersionsModule,
    // BaseDataModule,
    // CoursesModule,
    SlidesModule,
    ResourcesModule,
  ],
})
export class AppModule {}
