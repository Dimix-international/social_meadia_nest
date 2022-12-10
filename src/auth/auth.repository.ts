import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthRepository {
  async saveToken(userId: string, token: string) {
    return await AuthCollection.insertOne({ userId, token, invalidTokens: [] });
  }

  async updateToken(userId: string, token: string, oldToken: string) {
    return await AuthCollection.updateOne(
      { userId },
      {
        $set: { token },
        $push: { invalidTokens: oldToken },
      },
    );
  }

  async removeToken(token: string, userId: string) {
    await AuthCollection.updateOne(
      { userId },
      { $push: { invalidTokens: token } },
    );
    return await AuthCollection.deleteOne({ userId });
  }
}
