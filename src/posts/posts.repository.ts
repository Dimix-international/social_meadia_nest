import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post-nest.schema';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}
  async createPost(data: CreatePostType) {
    // const newPost = new this.postModel(data);
    // await newPost.save();
    return await this.postModel.create(data);
  }
  async deletePostById(id: string): Promise<DeleteResult> {
    return this.postModel.deleteOne({ id });
  }
  async updatePostById(
    id: string,
    data: UpdatePostType,
  ): Promise<UpdateResult> {
    return this.postModel.updateOne({ id }, { ...data });
  }
}

type CreatePostType = {
  id: string;
  blogName: string;
  createdAt: Date;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

type UpdatePostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
