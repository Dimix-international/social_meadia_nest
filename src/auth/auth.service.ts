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

  async logout(userId: string): Promise<boolean> {
    const { deletedCount } = await this.authRepository.removeToken(userId);
    return !!deletedCount;
  }

  async saveToken(userId: string, token: string): Promise<boolean> {
    await this.authRepository.saveToken(userId, token);
    return true;
  }

  async updateToken(userId: string, token: string): Promise<boolean> {
    const { matchedCount } = await this.authRepository.updateToken(
      userId,
      token,
    );
    return !!matchedCount;
  }
}

type CheckCredentialsType = {
  accessToken: string;
  refreshToken: string;
};

type UserPayloadType = {
  id: string;
};
