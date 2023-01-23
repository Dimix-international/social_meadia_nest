import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs/schema/blog-nest.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schema/post-nest.schema';
import { User, UserDocument } from '../users/schema/user-nest.schema';
import {
  Comment,
  CommentDocument,
} from '../comments/schema/comment-nest.schema';
import { Auth, AuthDocument } from '../auth/schema/auth-nest.schema';

@Injectable()
export class TestingDataRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}

  async deleteAllData() {
    await Promise.all([
      this.blogModel.deleteMany({}),
      this.postModel.deleteMany({}),
      this.userModel.deleteMany({}),
      this.commentModel.deleteMany({}),
      this.authModel.deleteMany({}),
    ]);
  }
}
