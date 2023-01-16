import { Injectable } from '@nestjs/common';
import { PostModel } from './schema/schemaType';

@Injectable()
export class PostsRepository {
  async createPost(data: CreatePostType) {
    const post = await PostModel.create(data);
    return post;
  }
  async deletePostById(id: string) {
    const deletedPost = await PostModel.deleteOne({ id });
    return deletedPost;
  }
  async updatePostById(id: string, data: UpdatePostType) {
    const updatedPost = await PostModel.updateOne({ id }, { ...data });
    return updatedPost;
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
