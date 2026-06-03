import { Injectable } from '@nestjs/common'
import { VersionsRepository } from './versions.repository'

@Injectable()
export class VersionsService {
  constructor(private readonly versionsRepository: VersionsRepository) {}

  async getCurrentVersion(systemName: string) {
    const row = await this.versionsRepository.findCurrent(systemName)
    return { systemName, version: row?.version ?? '1.0.0' }
  }

  saveVersion(dto: { systemName: string; version?: string }) {
    return this.versionsRepository.save(dto.systemName, dto.version ?? '1.0.0')
  }
}
