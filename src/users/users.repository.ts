import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user-nest.schema';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.userModel.deleteOne({ id });
  }
  async createUser(data: CreateUserType) {
    return this.userModel.create(data);
  }
  async activateUser(userId: string): Promise<UpdateResult> {
    return this.userModel.updateOne({ id: userId }, { isActivated: true });
  }
  async setNewPassword(
    userId: string,
    newPassword: string,
  ): Promise<UpdateResult> {
    return this.userModel.updateOne(
      { id: userId },
      {
        password: newPassword,
        isActivated: true,
      },
    );
  }

  async updateCountSendEmails(userId: string): Promise<UpdateResult> {
    return this.userModel.updateOne(
      { id: userId },
      { $inc: { countSendEmailsActivated: 1 } },
    );
  }

  async createNewActivatedCode(
    userId: string,
    code: string,
  ): Promise<UpdateResult> {
    console.log('userId', userId);
    console.log('code', code);
    return this.userModel.updateOne(
      { id: userId },
      { activationCode: code, isActivated: false },
    );
  }
}

type CreateUserType = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  activationCode: string;
  isActivated: boolean;
  countSendEmailsActivated: number;
};
