import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
// 这个模块的意思是：

// 创建 PrismaService
// exports: [PrismaService] 表示允许别的模块使用它
// @Global() 表示它是全局模块，其他模块不用重复 import 也能注入 PrismaService
// 所以你的 repository 里可以这样写：

// constructor(private readonly prisma: PrismaService) {}
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
