import { Injectable } from '@nestjs/common';
import { BlogModel } from '../blogs/schema/blog-schema';
import { PostModel } from '../posts/schema/schemaType';
import { CommentModel } from '../comments/schema/comment-schema';
import { UserModel } from '../users/schema/user-schema';
import { AuthModel } from '../auth/schema/schema-type';

@Injectable()
export class TestingDataRepository {
  async deleteAllData() {
    await Promise.all([
      BlogModel.deleteMany({}),
      PostModel.deleteMany({}),
      UserModel.deleteMany({}),
      CommentModel.deleteMany({}),
      AuthModel.deleteMany({}),
    ]);
  }
}
