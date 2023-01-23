import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class SecurityService {
  constructor(protected authRepository: AuthRepository) {}

  async terminateDevice(deviceId: string): Promise<void> {
    await this.authRepository.terminateDevice(deviceId);
  }

  async terminateAllRemoteDevices(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    await this.authRepository.terminateAllOtherDevices(userId, deviceId);
  }
}
