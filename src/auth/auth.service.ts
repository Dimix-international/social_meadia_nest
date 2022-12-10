import { Injectable } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { AuthQueryRepository } from './auth.query-repository';

@Injectable()
export class AuthService {
  constructor(
    protected jwtService: JwtService,
    protected authRepository: AuthRepository,
    protected authQueryRepository: AuthQueryRepository,
  ) {}

  async checkCredentials(
    clientPassword: string,
    userHashPassword: string,
    payload: UserPayloadType,
  ): Promise<CheckCredentialsType | null> {
    const isRightPassword = await bcrypt.compare(
      clientPassword,
      userHashPassword,
    );
    if (isRightPassword) {
      return await this.jwtService.createJWT(payload);
    }
    return null;
  }

  async logout(userId: string, oldToken: string): Promise<boolean> {
    const { matchedCount } = await this.authRepository.removeToken(
      userId,
      oldToken,
    );

    return !!matchedCount;
  }

  async saveToken(
    userId: string,
    token: string,
    oldToken: string,
  ): Promise<boolean> {
    const userInfo = await this.authQueryRepository.getUser(userId);
    if (userInfo) {
      const { matchedCount } = await this.authRepository.updateToken(
        userId,
        token,
        oldToken,
      );
      return !!matchedCount;
    } else {
      await this.authRepository.saveToken(userId, token);
      return true;
    }
  }
}

type CheckCredentialsType = {
  accessToken: string;
  refreshToken: string;
};

type UserPayloadType = {
  id: string;
};
