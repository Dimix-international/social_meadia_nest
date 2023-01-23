import { Injectable } from '@nestjs/common';
import { AuthModel } from './schema/schema-type';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schema/auth-nest.schema';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}

  async saveDevice(deviceData: DeviceDataType) {
    return this.authModel.create(deviceData);
  }

  async updateDeviceToken(deviceId: string, lastActiveDate: string) {
    await AuthModel.updateOne({ deviceId }, { lastActiveDate });
  }

  async terminateDevice(deviceId: string): Promise<DeleteResult> {
    return this.authModel.deleteOne({ deviceId });
  }
  async terminateAllOtherDevices(
    userId: string,
    currentDeviceId: string,
  ): Promise<DeleteResult> {
    return this.authModel.deleteMany({
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
