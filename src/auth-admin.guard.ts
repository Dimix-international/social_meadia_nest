import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { decodedBase64 } from './helpers/helpers';
import { PASSWORD_ADMIN, Roles } from './constants/general/general';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers) {
      throw new UnauthorizedException();
    }

    const token = request.headers.authorization?.split(' ')[1];
    const formAuth = request.headers.authorization?.split(' ')[0];

    if (!token || formAuth !== 'Basic') {
      throw new UnauthorizedException();
    }

    const decodedToken = decodedBase64(token);

    if (decodedToken !== `${Roles.ADMIN}:${PASSWORD_ADMIN}`) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
