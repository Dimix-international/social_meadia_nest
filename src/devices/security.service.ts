import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from '../auth/auth.repository';
import { AuthQueryRepository } from '../auth/auth.query-repository';

@Injectable()
export class SecurityService {
  constructor(
    protected authRepository: AuthRepository,
    protected authQueryRepository: AuthQueryRepository,
  ) {}

  async terminateDevice(deviceId: string): Promise<void> {
    await this.authRepository.terminateDevice(deviceId);
  }

  async terminateAllRemoteDevices(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    await this.authRepository.terminateAllOtherDevices(userId, deviceId);
  }

  async checkExistDevice(deviceId: string): Promise<void> {
    const device = await this.authQueryRepository.getDevice(deviceId);

    if (!device) {
      throw new NotFoundException();
    }
  }
}
