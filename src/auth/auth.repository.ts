import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthRepository {
  async saveToken(userId: string, token: string) {
    return await AuthCollection.insertOne({ userId, token });
  }

  async updateToken(token: string) {
    return await AuthCollection.updateOne(
      { token },
      {
        $set: { token },
      },
    );
  }

  async removeToken(token: string) {
    return await AuthCollection.deleteOne({ token });
  }
}
