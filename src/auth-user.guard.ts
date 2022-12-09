import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from './users/users.query-repository';
import { JwtService } from './jwt/jwt.service';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers) {
      throw new UnauthorizedException();
    }

    const accessToken = request.headers.authorization?.split(' ')[1];
    const formAuth = request.headers.authorization?.split(' ')[0];

    if (!accessToken || formAuth !== 'Bearer') {
      throw new UnauthorizedException();
    }

    const userId = await this.jwtService.validateAccessToken(accessToken);

    if (!userId) {
      throw new UnauthorizedException();
    }
    request.user = await this.usersQueryRepository.getUserById(userId);
    return true;
  }
}
