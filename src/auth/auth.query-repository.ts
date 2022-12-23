import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthQueryRepository {
  async getDevice(deviceId: string): Promise<GetUserType | null> {
    return await AuthCollection.findOne(
      { deviceId },
      { projection: { _id: 0 } },
    );
  }
  async getDevices(userId): Promise<GetUserType[]> {
    return await AuthCollection.find(
      { userId },
      { projection: { _id: 0 } },
    ).toArray();
  }
}

type GetUserType = {
  userId: string;
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};
