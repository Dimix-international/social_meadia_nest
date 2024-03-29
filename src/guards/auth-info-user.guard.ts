import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/users.query-repository';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthInfoUserGuard implements CanActivate {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    const userId = await this.jwtService.validateAccessToken(accessToken);
    request.user = await this.usersQueryRepository.getUserById(userId);
    return true;
  }
}
