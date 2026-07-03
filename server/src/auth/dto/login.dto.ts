import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  username: string

  @ApiProperty({ minLength: 6, example: '123456' })
  @IsString()
  @MinLength(6)
  password: string
}

export class RegisterDto extends LoginDto {}
