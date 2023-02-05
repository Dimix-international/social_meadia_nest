import { BlogsQueryRepository } from '../blogs/blogs.query-repository';
import { PostsRepository } from './posts.repository';
import { PostCreateModel } from '../models/posts/PostsCreateModel';
import { Injectable } from '@nestjs/common';
import { Post } from './dto';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { CommentsQueryRepository } from '../comments/comments.query-repository';
import {
  LikeInfoType,
  UserLikesQueryRepository,
} from '../userLikes/userLikes.query-repository';
import { CommentsViewModel } from '../models/comments/CommentsViewModel';

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
    protected commentsQueryRepository: CommentsQueryRepository,
    protected userLikesQueryRepository: UserLikesQueryRepository,
  ) {}

  async createPost(data: PostCreateModel): Promise<CreatePostType | null> {
    const { blogId } = data;
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (blog) {
      const { name } = blog;
      const { content, blogId, shortDescription, title } = data;
      // const newPost = new Post(title, shortDescription, content, blogId, name);
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
  async getCommentsForPost(
    data: CommentForPostType,
  ): Promise<CommentsViewModel> {
    const commentData = await this.commentsQueryRepository.getComments(data);

    const { items, ...restCommentData } = commentData;

    const promises = [];

    items.forEach((item) => {
      promises.push(this.userLikesQueryRepository.getLikesInfo(item.id));
    });

    const resultLikesInfo: LikeInfoType[] = await Promise.all(promises);

    const getLikes = (itemId) => {
      const document = resultLikesInfo.find(
        (item) => item.documentId === itemId,
      );
      return {
        likesCount: document?.likesCount || 0,
        dislikesCount: document?.dislikesCount || 0,
      };
    };

    return {
      ...restCommentData,
      items: items.map((item) => ({
        id: item.id,
        content: item.content,
        commentatorInfo: {
          userId: item.userId,
          userLogin: item.userLogin,
        },
        createdAt: item.createdAt,
        likesInfo: {
          ...getLikes(item.id),
          myStatus: item.likeStatus,
        },
      })),
    };
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

export type CommentForPostType = {
  postId: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
