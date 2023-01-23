import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schema/auth-nest.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}

  async getDevice(deviceId: string): Promise<GetDeviceType | null> {
    return this.authModel.findOne({ deviceId }).select('-_id ').lean();
  }
  async getDevices(userId): Promise<GetDeviceType[]> {
    return this.authModel.find({ userId }).select('-_id ').lean();
  }
}

type GetDeviceType = {
  lastActiveDate: string;
  ip: string;
  title: string;
  deviceId: string;
};
