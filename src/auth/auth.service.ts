import { Injectable } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService) {}

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
      const { accessToken } = await this.jwtService.createJWT(payload);
      return { accessToken };
    }
    return null;
  }
}

type CheckCredentialsType = {
  accessToken: string;
};

type UserPayloadType = {
  id: string;
};