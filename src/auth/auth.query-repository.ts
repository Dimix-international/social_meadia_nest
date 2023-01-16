import { Injectable } from '@nestjs/common';
import { AuthModel } from './schema/schema-type';

@Injectable()
export class AuthQueryRepository {
  async getDevice(deviceId: string): Promise<GetDeviceType | null> {
    const device = await AuthModel.findOne({ deviceId }).select('-_id -__v ');
    return device;
  }
  async getDevices(userId): Promise<GetDeviceType[]> {
    const devices = await AuthModel.find({ userId })
      .select('-_id -__v ')
      .lean();
    return devices;
  }
}

type GetDeviceType = {
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};
