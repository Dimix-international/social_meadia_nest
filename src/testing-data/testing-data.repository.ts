import { Injectable } from '@nestjs/common';
import {
  AuthCollection,
  BlogsCollection,
  CommentsCollection,
  PostsCollection,
  UsersCollection,
} from '../db';

@Injectable()
export class TestingDataRepository {
  async deleteAllData() {
    await Promise.all([
      BlogsCollection.deleteMany({}),
      PostsCollection.deleteMany({}),
      UsersCollection.deleteMany({}),
      CommentsCollection.deleteMany({}),
      AuthCollection.deleteMany({}),
    ]);
  }
}
