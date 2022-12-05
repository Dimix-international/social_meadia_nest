import { BlogCreateModel } from '../models/blogs/BlogCreateModel';
import { BlogViewModel } from '../models/blogs/BlogViewModel';
import { Blog } from './classes';
import { BlogUpdateModel } from '../models/blogs/BlogUpdateModel';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async createBlog(data: BlogCreateModel): Promise<BlogViewModel | null> {
    const { name, websiteUrl, description } = data;

    const insertedBlog = new Blog(name, websiteUrl, description);

    await this.blogsRepository.createBlog(insertedBlog);
    return {
      name: insertedBlog.name,
      createdAt: insertedBlog.createdAt,
      id: insertedBlog.id,
      websiteUrl: insertedBlog.websiteUrl,
      description: insertedBlog.description,
    };
  }
  async deleteBlogById(id: string): Promise<boolean> {
    const { deletedCount } = await this.blogsRepository.deleteBlogById(id);
    return !!deletedCount;
  }
  async updateBlogById(id: string, data: BlogUpdateModel) {
    const { matchedCount } = await this.blogsRepository.updateBlogById(
      id,
      data,
    );
    return !!matchedCount;
  }
}
