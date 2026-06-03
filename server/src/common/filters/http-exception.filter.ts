import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest<Request & { url: string; method: string }>()
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = this.resolveMessage(exception)

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} ${message}`, exception instanceof Error ? exception.stack : undefined)
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
    })
  }

  private resolveMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const body = exception.getResponse()
      if (typeof body === 'object' && body && 'message' in body) {
        const message = (body as { message: string | string[] }).message
        return Array.isArray(message) ? message.join('; ') : message
      }
      return exception.message
    }
    return exception instanceof Error ? exception.message : 'Internal server error'
  }
}
