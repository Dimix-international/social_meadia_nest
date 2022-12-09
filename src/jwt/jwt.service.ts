import { Injectable } from '@nestjs/common';
import { settings } from '../settings';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  async createJWT(payload: UserPayloadType): Promise<CreateJWTType> {
    const accessToken = jwt.sign(
      { userid: payload.id },
      settings.JWT_SECRET_ACCESS,
      { expiresIn: '10' },
    );
    const refreshToken = jwt.sign(
      { userid: payload.id },
      settings.JWT_SECRET_REFRESH,
      {
        expiresIn: '20',
      },
    );
    return { accessToken, refreshToken };
  }
  async validateAccessToken(accessToken: string) {
    try {
      const result: any = await jwt.verify(
        accessToken,
        settings.JWT_SECRET_ACCESS,
      );
      return result.userid as string;
    } catch (e) {
      return null;
    }
  }
  async validateRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET_REFRESH);
      return result.userid as string;
    } catch (e) {
      return null;
    }
  }
}

type CreateJWTType = {
  accessToken: string;
  refreshToken: string;
};

type UserPayloadType = {
  id: string;
};
