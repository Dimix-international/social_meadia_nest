import { Injectable } from '@nestjs/common';
import { PostsCollection } from '../db';

@Injectable()
export class PostsRepository {
  async createPost(data: CreatePostType) {
    return await PostsCollection.insertOne(data);
  }
  async deletePostById(id: string) {
    return await PostsCollection.deleteOne({ id });
  }
  async updatePostById(id: string, data: UpdatePostType) {
    return await PostsCollection.updateOne(
      { id },
      {
        $set: { ...data },
      },
    );
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
