import { Injectable } from '@nestjs/common';
import { AuthModel } from './schema/schema-type';

@Injectable()
export class AuthRepository {
  async saveDevice(deviceData: DeviceDataType) {
    const device = await AuthModel.create(deviceData);
    return device;
  }

  async updateDeviceToken(deviceId: string, lastActiveDate: string) {
    const updatedDeviceToken = await AuthModel.updateOne(
      { deviceId },
      { lastActiveDate },
    );
    return updatedDeviceToken;
  }

  async terminateDevice(deviceId: string) {
    const terminatedDevice = await AuthModel.deleteOne({ deviceId });
    return terminatedDevice;
  }
  async terminateAllOtherDevices(userId: string, currentDeviceId: string) {
    const terminatedDevices = await AuthModel.deleteMany({
      userId: userId,
      deviceId: { $ne: currentDeviceId },
    });
    return terminatedDevices;
  }
}

type DeviceDataType = {
  userId: string;
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};
