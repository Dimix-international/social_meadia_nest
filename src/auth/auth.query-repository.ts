import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthQueryRepository {
  async getDevice(deviceId: string): Promise<GetDeviceType | null> {
    return await AuthCollection.findOne(
      { deviceId },
      { projection: { _id: 0 } },
    );
  }
  async getDevices(userId): Promise<GetDeviceType[]> {
    return await AuthCollection.find(
      { userId },
      { projection: { _id: 0, userId: 0 } },
    ).toArray();
  }
}

type GetDeviceType = {
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};
