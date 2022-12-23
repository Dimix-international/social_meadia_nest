import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { transformInNumber } from '../helpers/helpers';
import { BlogsGetModel } from '../models/blogs/BlogsGetModel';
import { BlogUpdateModel } from '../models/blogs/BlogUpdateModel';
import { BlogCreateInput, BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query-repository';
import { PostCreateForBlogInput, PostsService } from '../posts/posts.service';
import { PostsQueryRepository } from '../posts/posts.query-repository';
import { HTTP_STATUSES } from '../constants/general/general';
import { AuthAdminGuard } from '../guards/auth-admin.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected postsService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsService: BlogsService,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogsGetModel) {
    const {
      searchNameTerm = null,
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = query;

    return await this.blogsQueryRepository.getBlogs(
      searchNameTerm,
      transformInNumber(pageNumber, 1),
      transformInNumber(pageSize, 10),
      sortBy,
      sortDirection,
    );
  }

  @Get('/:id')
  async getBlog(@Param('id') id: string) {
    const searchedBlog = await this.blogsQueryRepository.getBlogById(id);

    if (!searchedBlog) {
      throw new NotFoundException();
    }
    return searchedBlog;
  }

  @UseGuards(AuthAdminGuard)
  @Post()
  async createBlog(@Body() data: BlogCreateInput) {
    return await this.blogsService.createBlog(data);
  }

  @UseGuards(AuthAdminGuard)
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Delete('/:id')
  async deleteBlog(@Param('id') id: string) {
    const isDeletedBlog = await this.blogsService.deleteBlogById(id);

    if (!isDeletedBlog) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthAdminGuard)
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Put('/:id')
  async updateBlog(@Param('id') id: string, @Body() data: BlogUpdateModel) {
    const isUpdatedBlog = await this.blogsService.updateBlogById(id, data);

    if (!isUpdatedBlog) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthAdminGuard)
  @Post('/:blogId/posts')
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() data: PostCreateForBlogInput,
  ) {
    const blog = this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    const { title, content, shortDescription } = data;

    const post = await this.postsService.createPost({
      blogId,
      title,
      content,
      shortDescription,
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  @Get('/:blogId/posts')
  async getPostOfBlog(
    @Param('blogId') blogId: string,
    @Query() data: BlogsGetModel,
  ) {
    const searchBlog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!searchBlog) {
      throw new NotFoundException();
    }

    const {
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = data;

    const posts = await this.postsQueryRepository.getPostsForBlog(
      transformInNumber(pageNumber, 1),
      transformInNumber(pageSize, 10),
      sortBy,
      sortDirection,
      blogId,
    );

    if (!posts) {
      throw new NotFoundException();
    }

    return posts;
  }
}
