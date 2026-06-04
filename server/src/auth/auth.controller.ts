import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthUser } from './types/auth-user'

@Controller('classroom-slides/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.register(dto)
    this.setRefreshCookie(response, session.refreshToken)
    return this.toClientSession(session)
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.login(dto)
    this.setRefreshCookie(response, session.refreshToken)
    return this.toClientSession(session)
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = this.getCookie(request, 'refreshToken')
    if (!refreshToken) throw new UnauthorizedException('缺少刷新令牌')
    const session = await this.authService.refresh(refreshToken)
    this.setRefreshCookie(response, session.refreshToken)
    return this.toClientSession(session)
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.clearRefreshCookie(response)
    return { success: true }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: Request & { user: AuthUser }) {
    return this.authService.getCurrentUser(request.user)
  }

  private setRefreshCookie(response: Response, refreshToken: string) {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production'
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/classroom-slides/auth/refresh',
      maxAge: this.durationToMs(this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')),
    })
  }

  private clearRefreshCookie(response: Response) {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production'
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/classroom-slides/auth/refresh',
    })
  }

  private getCookie(request: Request, name: string) {
    const cookies = request.headers.cookie?.split(';') ?? []
    const cookie = cookies.find(item => item.trim().startsWith(`${name}=`))
    return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : undefined
  }

  private toClientSession<T extends { refreshToken: string }>(session: T) {
    const { refreshToken: _refreshToken, ...clientSession } = session
    return clientSession
  }

  private durationToMs(value: string) {
    const match = value.match(/^(\d+)(ms|s|m|h|d)?$/)
    if (!match) return 7 * 24 * 60 * 60 * 1000
    const amount = Number(match[1])
    const unit = match[2] ?? 'ms'
    const multipliers: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    }
    return amount * multipliers[unit]
  }
}
