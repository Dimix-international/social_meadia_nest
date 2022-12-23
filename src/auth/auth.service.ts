import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { AuthDeviceDTO } from './dto';
import { compareWithCurrentDate } from '../helpers/helpers';
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
  ): Promise<boolean> {
    const isRightPassword = await bcrypt.compare(
      clientPassword,
      userHashPassword,
    );
    return !!isRightPassword;
  }

  async logout(deviceId: string): Promise<boolean> {
    const { deletedCount } = await this.authRepository.terminateDevice(
      deviceId,
    );
    return !!deletedCount;
  }

  async saveDevice(deviceData: SaveDeviceDataType): Promise<JWTType> {
    const { userId, deviceTitle, ipAddress } = deviceData;

    const device = new AuthDeviceDTO(userId, deviceTitle, ipAddress);

    const { accessToken, refreshToken } = await this.jwtService.createJWT({
      deviceId: device.deviceId,
      userId,
    });

    const createdDateToken = await this.jwtService.getCreatedDateToken(
      refreshToken,
    );

    device.setDateToken(createdDateToken);

    await this.authRepository.saveDevice(device);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateDeviceToken(deviceId: string, token: string): Promise<boolean> {
    const lastActiveDate = await this.jwtService.getCreatedDateToken(token);

    const { matchedCount } = await this.authRepository.updateDeviceToken(
      deviceId,
      lastActiveDate,
    );
    return !!matchedCount;
  }

  async checkCorrectDeviceInfo(
    tokenInfo: CheckCorrectDeviceType,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const { deviceId } = tokenInfo;

    const device = await this.authQueryRepository.getDevice(deviceId);

    if (!device) {
      throw new UnauthorizedException();
    }

    const { lastActiveDate, ip: ipAddress, title } = device;

    if (
      !compareWithCurrentDate(lastActiveDate) ||
      ip !== ipAddress ||
      userAgent !== title
    ) {
      throw new ForbiddenException();
    }
  }

  async checkCorrectToken(
    refreshToken: string | undefined,
  ): Promise<CheckCorrectDeviceType> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokenInfo = await this.jwtService.validateRefreshToken(refreshToken);

    if (!tokenInfo) {
      throw new UnauthorizedException();
    }

    return tokenInfo;
  }
}

type SaveDeviceDataType = {
  userId: string;
  deviceTitle: string;
  ipAddress: string;
};

type JWTType = {
  accessToken: string;
  refreshToken: string;
};

type UpdateDeviceDataType = {
  createdDateToken;
  idAddress: string;
  deviceTitle: string;
};

type CheckCorrectDeviceType = {
  deviceId: string;
  userId: string;
};
