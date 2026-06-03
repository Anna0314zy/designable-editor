import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { UsersRepository } from './repositories/users.repository'
// 它负责：

// 注册登录接口：AuthController
// 注册登录业务：AuthService
// 注册用户查询：UsersRepository
// 注册 JWT 守卫：JwtAuthGuard
// 注册角色守卫：RolesGuard
// 配置 JWT 密钥和过期时间
// 一句话总结：

// Module 不是具体业务代码，而是“告诉 Nest：这个功能模块有哪些接口、服务、依赖，以及哪些东西能给别人用”。
// 你读代码时就可以先看每个 xxx.module.ts，它会告诉你这个功能模块的入口在哪里：看 controllers 找接口，看 providers 找业务类。
// @Module({
//   imports: [],      // 引入其他模块
//   controllers: [], // 注册路由控制器
//   providers: [],   // 注册服务、仓库、守卫等可注入对象
//   exports: [],     // 把本模块里的 provider 暴露给其他模块使用
// })
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '2h') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
