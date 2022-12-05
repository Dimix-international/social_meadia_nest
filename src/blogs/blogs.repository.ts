import { Injectable } from '@nestjs/common';
import { BlogsCollection } from '../db';

@Injectable()
export class BlogsRepository {
  async createBlog(blog: BlogCreateType) {
    return await BlogsCollection.insertOne(blog);
  }
  async deleteBlogById(id: string) {
    return await BlogsCollection.deleteOne({ id });
  }
  async updateBlogById(id: string, data: BlogUpdateType) {
    return await BlogsCollection.updateOne(
      { id },
      {
        $set: { ...data },
      },
    );
  }
}

export type BlogCreateType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};

type BlogUpdateType = {
  name: string;
  description: string;
  websiteUrl: string;
};
