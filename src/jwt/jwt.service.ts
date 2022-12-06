import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { settings } from '../settings';

@Injectable()
export class JwtService {
  async createJWT(payload: UserPayloadType): Promise<CreateJWTType> {
    const accessToken = jwt.sign(
      { userid: payload.id },
      settings.JWT_SECRET_ACCESS,
      { expiresIn: '30m' },
    );
    const refreshToken = jwt.sign(payload, settings.JWT_SECRET_REFRESH, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }
  async getUserIdByToken(accessToken: string) {
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
}

type CreateJWTType = {
  accessToken: string;
  refreshToken: string;
};

type UserPayloadType = {
  id: string;
};
