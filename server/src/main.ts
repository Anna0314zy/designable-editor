import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  // 创建 Nest 应用实例，AppModule 是整个服务端的根模块。
  // bufferLogs 会在应用日志系统完全初始化前先缓存日志，避免启动阶段日志丢失。
//   NestFactory 是什么

// NestFactory 是 NestJS 提供的“应用工厂”。

// 它负责把你的 NestJS 代码启动起来，包括：

// 创建应用实例
// 加载模块
// 扫描 Controller
// 扫描 Service
// 建立依赖注入关系
// 注册中间件/管道/过滤器/拦截器
// 准备 HTTP 服务器
// 1. 读取 AppModule
// 2. 找到 AppModule imports 里的所有模块
// 3. 加载每个模块里的 Controller 和 Service
// 4. 创建依赖注入容器
// 5. 把 Controller 的路由注册到 HTTP 服务里
// 6. 返回一个 app 对象
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  // 从 Nest 容器里取出 ConfigService，用来读取 .env 里的环境变量。
  const config = app.get(ConfigService)

  // 创建一个 Nest Logger，日志前缀会显示为 Bootstrap，方便定位启动相关日志。
  const logger = new Logger('Bootstrap')

  // 注册 helmet 中间件，给 HTTP 响应加一些安全相关的 header。
  // Swagger UI 依赖内联脚本/样式，关闭 CSP 后页面才能正常加载。
  app.use(helmet({ contentSecurityPolicy: false }))

  // 开启跨域配置，让 editor/task 这些前端开发服务可以访问这个 API 服务。
  app.enableCors({
    // CORS_ORIGIN 支持用逗号配置多个来源；如果没配置，就允许所有来源，方便本地开发。
    origin: config.get<string>('CORS_ORIGIN')?.split(',') ?? true,
    // 允许请求携带 cookie、Authorization header 等凭证信息。
    credentials: true,
  })

  // 注册全局参数校验管道，所有 Controller 的 DTO 都会经过这里。
  app.useGlobalPipes(
    new ValidationPipe({
      // 只保留 DTO 中声明过的字段，避免多余字段进入业务逻辑。
      whitelist: true,
      // 如果请求里出现 DTO 没声明的字段，直接返回 400，防止脏数据进入系统。
      forbidNonWhitelisted: true,
      // 自动把 query/body 参数转换成 DTO 里声明的类型，比如字符串 "1" 转成 number 1。
      transform: true,
    }),
  )
// 写法二：用 APP_FILTER / APP_INTERCEPTOR 注册全局 provider

// import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// @Module({
//   providers: [
//     {
//       provide: APP_FILTER,
//       useClass: HttpExceptionFilter,
//     },
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: ResponseInterceptor,
//     },
//   ],
// })
// export class AppModule {}
// 这种方式更“Nest 风格”，不需要在 main.ts 里手动注册：

// // main.ts 里就不用写 useGlobalFilters/useGlobalInterceptors 了
// 简单判断：

// 不需要注入依赖：new HttpExceptionFilter() 可以
// 需要注入 service/config/logger：用 app.get() 或 APP_FILTER
// 项目想更模块化：推荐 APP_FILTER / APP_INTERCEPTOR
  // 注册全局异常过滤器，把 Nest 抛出的异常统一转换成 { code, message, data }。
  app.useGlobalFilters(new HttpExceptionFilter())

  // 注册全局响应拦截器，把正常返回值统一包成 { code: 200, message: 'success', data }。
  app.useGlobalInterceptors(new ResponseInterceptor())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Slides Engine API')
    .setDescription('Classroom slides editor backend API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api-docs', app, swaggerDocument, {
    jsonDocumentUrl: 'api-docs-json',
  })

  // 从环境变量读取端口；如果没有配置 PORT，就默认监听 5177。
  const port = config.get<number>('PORT', 5177)

  // 启动 HTTP 服务，开始监听端口。
  await app.listen(port)

  // 服务启动成功后输出一条日志，告诉开发者 API 地址。
  logger.log(`slides-engine api listening on http://localhost:${port}`)
  logger.log(`swagger docs available at http://localhost:${port}/api-docs`)
}

// 执行 bootstrap。
// void 表示我们有意不 await 这个 Promise，避免 TypeScript/ESLint 报“未处理 Promise”的提示。
void bootstrap()
