import { Injectable } from '@nestjs/common';
import { AuthCollection } from '../db';

@Injectable()
export class AuthQueryRepository {
  async getUser(userId: string): Promise<GetUserType | null> {
    return await AuthCollection.findOne({ userId }, { projection: { _id: 0 } });
  }
}

type GetUserType = {
  userId: string;
  token: string;
};
