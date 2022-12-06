import { Injectable } from '@nestjs/common';
import { UsersCollection } from '../db';

@Injectable()
export class UsersRepository {
  async deleteUser(id: string) {
    return await UsersCollection.deleteOne({ id });
  }
  async createUser(data: CreateUserType) {
    return await UsersCollection.insertOne(data);
  }
  async activateUser(userId: string) {
    return await UsersCollection.updateOne(
      { id: userId },
      { $set: { isActivated: true } },
    );
  }
  async updateCountSendEmails(userId: string) {
    return await UsersCollection.updateOne(
      { id: userId },
      { $inc: { countSendEmailsActivated: 1 } },
    );
  }
  async createNewActivatedCode(userId: string, code: string) {
    return await UsersCollection.updateOne(
      { id: userId },
      { $set: { activationCode: code } },
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
