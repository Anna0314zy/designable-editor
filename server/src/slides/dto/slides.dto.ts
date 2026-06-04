import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreatePageDto {
  @ApiProperty({ example: 'slide_001' })
  @IsString()
  slideId: string

  @ApiProperty({ minimum: 1, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageType: number
}

export class SaveSlideDto {
  @ApiProperty({ example: '{"pages":[]}' })
  @IsString()
  slideStructure: string
}

export class DeletePageDto {
  @ApiProperty({ example: 'page_001' })
  @IsString()
  pageId: string
}

export class SavePageDto {
  @ApiProperty({ example: '{"nodes":[]}' })
  @IsString()
  mainContentStructure: string

  @ApiPropertyOptional({ type: [String], example: ['md5_value'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileMd5List?: string[]

  @ApiPropertyOptional({ example: 'game_001' })
  @IsOptional()
  @IsString()
  gameId?: string

  @ApiPropertyOptional({ example: 'template_001' })
  @IsOptional()
  @IsString()
  gameTemplateId?: string
}

export class SaveTasksDto {
  @ApiProperty({ example: 'slide_001' })
  @IsString()
  slideId: string

  @ApiProperty({ example: 'page_001' })
  @IsString()
  pageId: string

  @ApiProperty({ type: [Object], example: [{ id: 'task_001', type: 'question' }] })
  @IsArray()
  courseTaskList: Array<Record<string, unknown>>
}

export class ExitEditDto {
  @ApiProperty({ example: 'lock-token' })
  @IsString()
  lockToken: string
}

export class RollbackPublishDto {
  @ApiProperty({ example: 'publish-record-id' })
  @IsString()
  publishRecordId: string
}
