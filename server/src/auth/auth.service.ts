import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { LoginDto, RegisterDto } from './dto/login.dto'
import { UsersRepository } from './repositories/users.repository'
import { AuthUser } from './types/auth-user'
// Nest 看到 AuthService 需要 UsersRepository，
// 就会去当前 module 的 providers 里找有没有注册 UsersRepository。找到了，就创建/复用一个实例传进去。
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findByUsername(dto.username)
    if (existing) throw new ConflictException('用户名已存在')

    const user = await this.createUser(dto)
    return this.issueTokens({ sub: user.id, username: user.username, roles: user.roles })
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findByUsername(dto.username)
    if (!user) {
      const createdUser = await this.createUser(dto)
      return this.issueTokens({ sub: createdUser.id, username: createdUser.username, roles: createdUser.roles })
    }

    if (!(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    return this.issueTokens({ sub: user.id, username: user.username, roles: user.roles })
  }

  async refresh(refreshToken: string) {
    const user = this.verifyToken(refreshToken, 'refresh')
    const latestUser = await this.usersRepository.findById(user.sub)
    if (!latestUser) throw new UnauthorizedException('用户不存在或已被删除')
    return this.issueTokens({ sub: latestUser.id, username: latestUser.username, roles: latestUser.roles })
  }

  async getCurrentUser(user: AuthUser) {
    const latestUser = await this.usersRepository.findById(user.sub)
    if (!latestUser) throw new UnauthorizedException('用户不存在或已被删除')
    return {
      id: latestUser.id,
      username: latestUser.username,
      roles: latestUser.roles,
    }
  }

  verifyToken(token: string, tokenType: 'access' | 'refresh' = 'access'): AuthUser {
    const user = this.jwtService.verify<AuthUser & { tokenType?: string }>(token)
    if (user.tokenType !== tokenType) throw new UnauthorizedException('认证令牌类型不正确')
    return { sub: user.sub, username: user.username, roles: user.roles }
  }

  private async createUser(dto: LoginDto) {
    const saltRounds = this.config.get<number>('BCRYPT_SALT_ROUNDS', 12)
    const passwordHash = await bcrypt.hash(dto.password, saltRounds)
    return this.usersRepository.create({
      username: dto.username,
      passwordHash,
      roles: [UserRole.editor],
    })
  }

  private issueTokens(user: AuthUser) {
    const accessToken = this.jwtService.sign({ ...user, tokenType: 'access' })
    const refreshToken = this.jwtService.sign(
      { ...user, tokenType: 'refresh' },
      { expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') },
    )

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.sub,
        username: user.username,
        roles: user.roles,
      },
    }
  }
}
