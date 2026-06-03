import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CourseListDto {
  @ApiProperty({ minimum: 1, example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNo: number

  @ApiProperty({ minimum: 1, example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number

  @ApiPropertyOptional({ example: '010' })
  @IsOptional()
  @IsString()
  cityId?: string

  @ApiPropertyOptional({ example: '人教版' })
  @IsOptional()
  @IsString()
  bookVersion?: string

  @ApiPropertyOptional({ example: 'product_001' })
  @IsOptional()
  @IsString()
  id?: string

  @ApiPropertyOptional({ example: '数学课包' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'course' })
  @IsOptional()
  @IsString()
  productType?: string

  @ApiPropertyOptional({ example: 'spring' })
  @IsOptional()
  @IsString()
  seasonId?: string

  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  year?: string

  @ApiPropertyOptional({ example: 'grade_001' })
  @IsOptional()
  @IsString()
  gradeId?: string

  @ApiPropertyOptional({ example: 'math' })
  @IsOptional()
  @IsString()
  subjectId?: string
}

export class ProductAttributesDto {
  @ApiPropertyOptional({ example: 'school_001' })
  @IsOptional()
  @IsString()
  schoolCode?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  searchType?: number

  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  year?: string

  @ApiPropertyOptional({ example: 'course' })
  @IsOptional()
  @IsString()
  productType?: string

  @ApiPropertyOptional({ example: 'spring' })
  @IsOptional()
  @IsString()
  seasonId?: string

  @ApiPropertyOptional({ example: 'grade_001' })
  @IsOptional()
  @IsString()
  gradeId?: string

  @ApiPropertyOptional({ example: 'math' })
  @IsOptional()
  @IsString()
  subjectId?: string

  @ApiPropertyOptional({ example: 'category_001' })
  @IsOptional()
  @IsString()
  categoryId?: string

  @ApiPropertyOptional({ example: 'approved' })
  @IsOptional()
  @IsString()
  auditStatus?: string

  @ApiPropertyOptional({ example: 'enabled' })
  @IsOptional()
  @IsString()
  status?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sign?: number
}

export class AddLessonInformationDto {
  @ApiProperty({ example: 'lesson_package_001' })
  @IsString()
  mainId: string

  @ApiProperty({ example: '1' })
  @IsString()
  serialNumber: string

  @ApiProperty({ example: '{"title":"第一讲"}' })
  @IsString()
  lessonInformation: string
}

export class BindSlideDto {
  @ApiProperty({ example: 'lesson_package_001' })
  @IsString()
  mainId: string

  @ApiProperty({ example: '1' })
  @IsString()
  serialNumber: string

  @ApiProperty({ example: 'slide_001' })
  @IsString()
  slideId: string

  @ApiPropertyOptional({ example: '第一讲课件' })
  @IsOptional()
  @IsString()
  slideTitle?: string
}
