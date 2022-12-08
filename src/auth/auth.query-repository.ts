import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthQueryRepository {
  async getUserIdByToken(token: string): Promise<string | null> {
    const info = await AuthCollection.findOne({ token });
    return info?.userId || null;
  }
  async getUser(userId: string): Promise<GetUserType | null> {
    return await AuthCollection.findOne({ userId }, { projection: { _id: 0 } });
  }
}

type GetUserType = {
  userId: string;
  token: string;
};
