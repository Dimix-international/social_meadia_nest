import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { transformInNumber } from '../helpers/helpers';
import { BlogsGetModel } from '../models/blogs/BlogsGetModel';
import { BlogCreateModel } from '../models/blogs/BlogCreateModel';
import { BlogUpdateModel } from '../models/blogs/BlogUpdateModel';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    // protected postsQueryRepository: PostsQueryRepository,
    // protected postsService: PostsService,
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

  @Get()
  async getBlog(@Param('id') id: string) {
    const searchedBlog = await this.blogsQueryRepository.getBlogById(id);

    if (searchedBlog) {
      return searchedBlog;
    } else {
      throw NotFoundException;
    }
  }

  @Post()
  async createBlog(@Body() data: BlogCreateModel) {
    return await this.blogsService.createBlog(data);
  }

  @Delete()
  async deleteBlog(@Param('id') id: string) {
    return await this.blogsService.deleteBlogById(id);
  }

  @Put()
  async updateBlog(@Param('id') id: string, @Body() data: BlogUpdateModel) {
    return await this.blogsService.updateBlogById(id, data);
  }
  /*
  async createPostForBlog(
    req: RequestWithParamsBody<
      BlogCreatePostBlogURIParamsModel,
      BlogCreatePostForBlogModel
    >,
    res: Response<BlogWithCreatedPostViewModel>,
  ) {
    const { blogId } = req.params;
    const { title, content, shortDescription } = req.body;

    const post = await this.postsService.createPost({
      blogId,
      title,
      content,
      shortDescription,
    });

    if (!post) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    res.status(HTTP_STATUSES.CREATED_201).send(post);
  }

  async getPostOfBlog(
    req: RequestWithQueryParamsAndParams<
      BlogCreatePostBlogURIParamsModel,
      PostsGetModel
    >,
    res: Response<PostsForBlogViewModel>,
  ) {
    const { blogId } = req.params;

    const searchBlog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!searchBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const {
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = req.query;

    const posts = await this.postsQueryRepository.getPostsForBlog(
      transformInNumber(pageNumber, 1),
      transformInNumber(pageSize, 10),
      sortBy,
      sortDirection,
      blogId,
    );

    if (!posts) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    res.status(HTTP_STATUSES.OK_200).send(posts);
  }*/
}
