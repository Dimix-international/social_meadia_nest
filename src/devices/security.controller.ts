import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Ip,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { AuthQueryRepository } from '../auth/auth.query-repository';
import { Cookies } from '../decorators/params/cookies.decorator';
import { HTTP_STATUSES } from '../constants/general/general';
import { UserAgent } from '../decorators/params/user-agent.decorator';
import { SecurityService } from './security.service';
import { AuthService } from '../auth/auth.service';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('security')
export class SecurityControllerController {
  constructor(
    protected authQueryRepository: AuthQueryRepository,
    protected authService: AuthService,
    protected deviceService: SecurityService,
  ) {}

  @Get('/devices')
  async getActiveDevices(
    @Cookies('refreshToken') refreshToken: string | undefined,
  ) {
    const tokenInfo = await this.authService.checkCorrectToken(refreshToken);
    return await this.authQueryRepository.getDevices(tokenInfo.userId);
  }

  @Delete('devices/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async terminateDevice(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Cookies('refreshToken') refreshToken: string | undefined,
    @Param('id') removeDevice: string,
  ) {
    const tokenInfo = await this.authService.checkCorrectToken(refreshToken);

    await this.deviceService.checkExistDevice(removeDevice);
    await this.authService.checkCorrectDeviceInfo(tokenInfo, ip, userAgent);

    const allDevices = await this.authQueryRepository.getDevices(
      tokenInfo.userId,
    );

    const devicesId = allDevices.map((d) => d.deviceId);

    if (!devicesId.includes(removeDevice)) {
      throw new ForbiddenException();
    }

    await this.deviceService.terminateDevice(removeDevice);
  }

  @Delete('/devices')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async terminateRemoteDevices(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Cookies('refreshToken') refreshToken: string | undefined,
  ) {
    const tokenInfo = await this.authService.checkCorrectToken(refreshToken);

    await this.authService.checkCorrectDeviceInfo(tokenInfo, ip, userAgent);

    const { deviceId, userId } = tokenInfo;

    await this.deviceService.terminateAllRemoteDevices(deviceId, userId);
  }
}
