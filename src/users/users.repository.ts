import { Injectable } from '@nestjs/common';
import { UserModel } from './schema/user-schema';

@Injectable()
export class UsersRepository {
  async deleteUser(id: string) {
    const deletedUser = await UserModel.deleteOne({ id });
    return deletedUser;
  }
  async createUser(data: CreateUserType) {
    const createdUser = await UserModel.create(data);
    return createdUser;
  }
  async activateUser(userId: string) {
    const updatedUser = await UserModel.updateOne(
      { id: userId },
      { isActivated: true },
    );
    return updatedUser;
  }
  async updateCountSendEmails(userId: string) {
    const updatedUser = await UserModel.updateOne(
      { id: userId },
      { $inc: { countSendEmailsActivated: 1 } },
    );
    return updatedUser;
  }
  async createNewActivatedCode(userId: string, code: string) {
    const updatedUser = await UserModel.updateOne(
      { id: userId },
      { activationCode: code },
    );
    return updatedUser;
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
