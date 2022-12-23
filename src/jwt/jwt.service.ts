import { Injectable } from '@nestjs/common';
import { settings } from '../settings';
import * as jwt from 'jsonwebtoken';
import {
  EXPIRES_TIME_ACCESS_TOKEN,
  EXPIRES_TIME_REFRESH_TOKEN,
} from '../constants/general/general';

@Injectable()
export class JwtService {
  async createJWT(payload: UserPayloadType): Promise<CreateJWTType> {
    const accessToken = jwt.sign(
      { deviceId: payload.deviceId, userId: payload.userId },
      settings.JWT_SECRET_ACCESS,
      { expiresIn: EXPIRES_TIME_ACCESS_TOKEN },
    );
    const refreshToken = jwt.sign(
      { deviceId: payload.deviceId, userId: payload.userId },
      settings.JWT_SECRET_REFRESH,
      {
        expiresIn: EXPIRES_TIME_REFRESH_TOKEN,
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
      return result.deviceId as string;
    } catch (e) {
      return null;
    }
  }
  async validateRefreshToken(token: string) {
    try {
      const { deviceId, userId }: any = jwt.verify(
        token,
        settings.JWT_SECRET_REFRESH,
      );
      return {
        deviceId,
        userId,
      };
    } catch (e) {
      return null;
    }
  }
  async getCreatedDateToken(token: string) {
    const payload: any = jwt.decode(token);
    return new Date(payload.iat * 1000).toISOString();
  }

  // @Cron('every hour')
  // async test() {
  //   await devicesRepo.deleteMany({ lastActiveDate: { $sme: dateNow - 10000 } });
  // }
}

type CreateJWTType = {
  accessToken: string;
  refreshToken: string;
};

type UserPayloadType = {
  deviceId: string;
  userId: string;
};
