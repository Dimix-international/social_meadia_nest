import { Injectable } from '@nestjs/common';
import { BlogModel } from './schema/blog-schema';

@Injectable()
export class BlogsRepository {
  async createBlog(blog: BlogCreateType) {
    // return await BlogsCollection.insertOne(blog);
    return await BlogModel.create(blog);
  }
  async deleteBlogById(id: string) {
    //return await BlogsCollection.deleteOne({ id });
    const deletedBlog = await BlogModel.deleteOne({ id });
    return deletedBlog;
  }
  async updateBlogById(id: string, data: BlogUpdateType) {
    /*    return await BlogsCollection.updateOne(
      { id },
      {
        $set: { ...data },
      },
    );*/
    const updatedBlog = await BlogModel.updateOne({ id }, { ...data });
    return updatedBlog;
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
