import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthRepository {
  async saveToken(userId: string, token: string) {
    return await AuthCollection.insertOne({ userId, token });
  }

  async updateToken(userId: string, token: string) {
    return await AuthCollection.updateOne({ userId }, { $set: { token } });
  }

  async removeToken(userId: string) {
    return await AuthCollection.deleteOne({ userId });
  }
}
