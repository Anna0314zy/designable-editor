import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as STS from 'qcloud-cos-sts'
import { CreateResourceDto, ResourceRelationDto } from './dto/resource.dto'
import { ResourcesRepository } from './resources.repository'

type StsCredentialResponse = {
  credentials?: {
    tmpSecretId?: string
    tmpSecretKey?: string
    sessionToken?: string
    TmpSecretId?: string
    TmpSecretKey?: string
    Token?: string
  }
  TmpSecretId?: string
  TmpSecretKey?: string
  Token?: string
  startTime?: number
  expiredTime?: number
}

@Injectable()
export class ResourcesService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly config: ConfigService,
  ) {}

  async findByMd5(fileMd5: string) {
    return (await this.resourcesRepository.findByMd5(fileMd5)) ?? {}
  }

  create(dto: CreateResourceDto) {
    return this.resourcesRepository.create(dto)
  }

  getCosConfig() {
    const cdnPath = this.config.get<string>('COS_CDN_PATH', 'http://localhost:5177/static')
    return {
      fileFolder: 'slides',
      bucket: this.config.get<string>('COS_BUCKET'),
      region: this.config.get<string>('COS_REGION', 'ap-beijing'),
      cdnPath,
      cdnPathList: [cdnPath],
      pathConfigList: [
        { name: '图片', path: 'image', type: 'pic' },
        { name: '视频', path: 'video', type: 'video' },
        { name: '音频', path: 'audio', type: 'audio' },
      ],
    }
  }

  async getCredential(bucketName?: string) {
    const secretId = this.config.get<string>('COS_SECRET_ID')
    const secretKey = this.config.get<string>('COS_SECRET_KEY')
    const region = this.config.get<string>('COS_REGION', 'ap-beijing')
    const bucket = bucketName || this.config.get<string>('COS_BUCKET')
    const appId = this.config.get<string>('COS_APP_ID') || this.resolveAppId(bucket)

    if (!secretId || !secretKey) {
      throw new BadRequestException('缺少 COS_SECRET_ID 或 COS_SECRET_KEY 配置')
    }
    if (!bucket) {
      throw new BadRequestException('缺少 bucketName 参数或 COS_BUCKET 配置')
    }
    if (!appId) {
      throw new BadRequestException('缺少 COS_APP_ID 配置，且无法从 bucketName 中解析 appid')
    }

    const durationSeconds = this.config.get<number>('COS_DURATION_SECONDS', 1800)
    const actions = this.getAllowActions()
    const resourcePath = this.config.get<string>('COS_RESOURCE_PATH', '*')
    const policy = {
      version: '2.0',
      statement: [
        {
          action: actions,
          effect: 'allow',
          resource: [`qcs::cos:${region}:uid/${appId}:${bucket}/${resourcePath}`],
        },
      ],
    }
    const tempKeys = await this.getStsCredential({
      secretId,
      secretKey,
      region,
      durationSeconds,
      policy,
    })
    const credentials = tempKeys.credentials ?? {}
    const tmpSecretId = credentials.tmpSecretId ?? credentials.TmpSecretId ?? tempKeys.TmpSecretId
    const tmpSecretKey = credentials.tmpSecretKey ?? credentials.TmpSecretKey ?? tempKeys.TmpSecretKey
    const sessionToken = credentials.sessionToken ?? credentials.Token ?? tempKeys.Token

    if (!tmpSecretId || !tmpSecretKey || !sessionToken) {
      throw new InternalServerErrorException('腾讯云 STS 返回的临时秘钥格式不完整')
    }

    return {
      credentials: {
        tmpSecretId,
        tmpSecretKey,
        sessionToken,
      },
      startTime: tempKeys.startTime,
      expiredTime: tempKeys.expiredTime,
      bucket,
      region,
    }
  }

  private getAllowActions() {
    const configured = this.config.get<string>('COS_ALLOW_ACTIONS')
    if (!configured) return ['name/cos:PutObject', 'name/cos:GetObject']
    return configured
      .split(',')
      .map(action => action.trim())
      .filter(Boolean)
  }

  private resolveAppId(bucket?: string) {
    return bucket?.match(/-(\d+)$/)?.[1]
  }

  private getStsCredential(options: {
    secretId: string
    secretKey: string
    region: string
    durationSeconds: number
    policy: unknown
  }) {
    return new Promise<StsCredentialResponse>((resolve, reject) => {
      STS.getCredential(options, (err: Error | null, tempKeys: unknown) => {
        if (err) {
          reject(new InternalServerErrorException(`获取 COS 临时秘钥失败：${err.message}`))
          return
        }
        resolve(tempKeys as StsCredentialResponse)
      })
    })
  }

  addRelation(dto: ResourceRelationDto) {
    return this.resourcesRepository.addRelation(dto.pageId, dto.fileMd5)
  }

  removeRelation(dto: ResourceRelationDto) {
    return this.resourcesRepository.removeRelation(dto.pageId, dto.fileMd5)
  }
}
