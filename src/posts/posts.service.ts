import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
import { PostsRepository } from './posts.repository';
import { PostCreateModel } from '../models/posts/PostsCreateModel';
import { Injectable } from '@nestjs/common';
import { Post } from './classes';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class PostCreateInput {
  @IsNotEmpty({ message: 'This field is required!' })
  @MaxLength(30, { message: 'Max 30 symbols!' })
  title: string;

  @IsNotEmpty({ message: 'This field is required!' })
  @MaxLength(100, { message: 'Max 100 symbols!' })
  shortDescription: string;

  @IsNotEmpty({ message: 'This field is required!' })
  @MaxLength(1000, { message: 'Max 1000 symbols!' })
  content: string;

  @IsNotEmpty({ message: 'This field is required!' })
  blogId: string;
}

export class PostCreateForBlogInput {
  @IsNotEmpty({ message: 'This field is required!' })
  @MaxLength(30, { message: 'Max 30 symbols!' })
  title: string;

  @IsNotEmpty({ message: 'This field is required!' })
  @MaxLength(100, { message: 'Max 100 symbols!' })
  shortDescription: string;

  @IsNotEmpty({ message: 'This field is required!' })
  @MaxLength(1000, { message: 'Max 1000 symbols!' })
  content: string;
}

@Injectable()
export class PostsService {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsRepository: PostsRepository,
  ) {}

  async createPost(data: PostCreateModel): Promise<CreatePostType | null> {
    const { blogId } = data;
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (blog) {
      const { name } = blog;
      const { content, blogId, shortDescription, title } = data;
      const newPost = new Post(title, shortDescription, content, blogId, name);
      await this.postsRepository.createPost(newPost);
      return {
        id: newPost.id,
        createdAt: newPost.createdAt,
        blogName: newPost.blogName,
        title: newPost.title,
        content: newPost.content,
        blogId: newPost.blogId,
        shortDescription: newPost.shortDescription,
      };
    }
    return null;
  }
  async deletePostById(id: string): Promise<boolean> {
    const { deletedCount } = await this.postsRepository.deletePostById(id);
    return !!deletedCount;
  }
  async updatePostById(id: string, data: UpdatePostType): Promise<boolean> {
    const { matchedCount } = await this.postsRepository.updatePostById(
      id,
      data,
    );
    return !!matchedCount;
  }
}

export type CreatePostType = {
  id: string;
  blogName: string;
  createdAt: Date;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type UpdatePostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
