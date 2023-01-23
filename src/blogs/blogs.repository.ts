import { Injectable } from '@nestjs/common';
import { BlogModel } from './schema/blog-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schema/blog-nest.schema';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}
  async createBlog(blog: BlogCreateType) {
    // return await BlogsCollection.insertOne(blog);
    return this.blogModel.create(blog);
  }
  async deleteBlogById(id: string): Promise<DeleteResult> {
    //return await BlogsCollection.deleteOne({ id });
    return this.blogModel.deleteOne({ id });
  }
  async updateBlogById(
    id: string,
    data: BlogUpdateType,
  ): Promise<UpdateResult> {
    /*    return await BlogsCollection.updateOne(
      { id },
      {
        $set: { ...data },
      },
    );*/
    return this.blogModel.updateOne({ id }, { ...data });
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
