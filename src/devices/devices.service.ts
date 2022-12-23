import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class DevicesService {
  constructor(protected authRepository: AuthRepository) {}

  async terminateDevice(deviceId: string): Promise<boolean> {
    const { deletedCount } = await this.authRepository.terminateDevice(
      deviceId,
    );
    return !!deletedCount;
  }

  async terminateAllRemoteDevices(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    await this.authRepository.terminateAllOtherDevices(userId, deviceId);
  }
}
