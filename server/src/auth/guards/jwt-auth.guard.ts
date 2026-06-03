import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, '') || request.headers.token
    if (!token) throw new UnauthorizedException('缺少认证令牌')
    request.user = this.authService.verifyToken(String(token))
    return true
  }
}
