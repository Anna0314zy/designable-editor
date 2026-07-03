import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'node:crypto'
import { SlidesRepository } from './slides.repository'
import { SlidesService } from './slides.service'

@Injectable()
export class SlidesPublishWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SlidesPublishWorker.name)
  private readonly workerId = `publish-worker-${randomUUID()}`
  private timer?: NodeJS.Timeout
  private running = false

  constructor(
    private readonly slidesRepository: SlidesRepository,
    private readonly slidesService: SlidesService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    if (this.config.get<string>('PUBLISH_WORKER_ENABLED', 'true') === 'false') return

    const pollMs = this.config.get<number>('PUBLISH_WORKER_POLL_MS', 3_000)
    this.timer = setInterval(() => void this.tick(), pollMs)
    void this.tick()
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer)
  }

  private async tick() {
    if (this.running) return
    this.running = true
    try {
      const staleAfterMs = this.config.get<number>('PUBLISH_JOB_STALE_AFTER_MS', 10 * 60_000)
      const job = await this.slidesRepository.acquireNextPublishJob({
        workerId: this.workerId,
        staleAfterMs,
      })
      if (!job) return

      await this.runJob(job)
    } catch (error) {
      this.logger.error(`发布任务轮询失败：${this.getErrorMessage(error)}`)
    } finally {
      this.running = false
    }
  }

  private async runJob(job: NonNullable<Awaited<ReturnType<SlidesRepository['acquireNextPublishJob']>>>) {
    try {
      await this.slidesService.executePublishJob(job)
      await this.slidesRepository.markPublishJobSuccess(job.id)
    } catch (error) {
      const errorMessage = this.getErrorMessage(error)
      if (job.attempts >= job.maxAttempts) {
        await this.markFinalFailure(job, errorMessage)
        return
      }

      await this.slidesRepository.markPublishJobRetry({
        jobId: job.id,
        errorMessage,
        nextRunAt: this.getNextRunAt(job.attempts),
      })
    }
  }

  private async markFinalFailure(
    job: NonNullable<Awaited<ReturnType<SlidesRepository['acquireNextPublishJob']>>>,
    errorMessage: string,
  ) {
    try {
      await this.slidesRepository.markPublishFailed({
        slideId: job.slideId,
        publishRecordId: job.publishRecordId,
        errorMessage,
      })
    } finally {
      await this.slidesRepository.markPublishJobFailed({
        jobId: job.id,
        errorMessage,
      })
    }
  }

  private getNextRunAt(attempts: number) {
    const delayMs = Math.min(60_000, 2 ** attempts * 1_000)
    return new Date(Date.now() + delayMs)
  }

  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error)
  }
}
