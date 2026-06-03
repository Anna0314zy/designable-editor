import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreateResourceDto {
  @ApiProperty({ example: 'resources/image.png' })
  @IsString()
  cosFullPath: string

  @ApiProperty({ example: 'd41d8cd98f00b204e9800998ecf8427e' })
  @IsString()
  fileMd5: string

  @ApiProperty({ example: 'image.png' })
  @IsString()
  fileName: string

  @ApiProperty({ minimum: 0, example: 1024 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fileSize: number

  @ApiProperty({ example: 'image' })
  @IsString()
  resourceType: string

  @ApiPropertyOptional({ example: 'png' })
  @IsOptional()
  @IsString()
  resourceFormat?: string

  @ApiPropertyOptional({ example: 'image/png' })
  @IsOptional()
  @IsString()
  fileType?: string

  @ApiPropertyOptional({ example: 1920 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  width?: number

  @ApiPropertyOptional({ example: 1080 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  height?: number

  @ApiPropertyOptional({ example: 'success' })
  @IsOptional()
  @IsString()
  status?: string

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  percent?: number

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  uploadPercent?: number

  @ApiPropertyOptional({ example: 'blob:http://localhost:5173/example' })
  @IsOptional()
  @IsString()
  localUrl?: string

  @ApiPropertyOptional({ example: 'element_001' })
  @IsOptional()
  @IsString()
  elementId?: string
}

export class ResourceRelationDto {
  @ApiProperty({ example: 'page_001' })
  @IsString()
  pageId: string

  @ApiProperty({ example: 'd41d8cd98f00b204e9800998ecf8427e' })
  @IsString()
  fileMd5: string
}
