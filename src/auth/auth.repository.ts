import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthRepository {
  async saveDevice(deviceData: DeviceDataType) {
    return await AuthCollection.insertOne(deviceData);
  }

  async updateDeviceToken(deviceId: string, updateData: UpdateDeviceDataType) {
    return await AuthCollection.updateOne(
      { deviceId },
      {
        $set: updateData,
      },
    );
  }

  async terminateDevice(deviceId: string) {
    return await AuthCollection.deleteOne({ deviceId });
  }
  async terminateAllOtherDevices(userId: string, currentDeviceId: string) {
    return await AuthCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: currentDeviceId },
    });
  }
}

type DeviceDataType = {
  userId: string;
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};

type UpdateDeviceDataType = {
  lastActiveDate;
  ip: string;
  title: string;
};
