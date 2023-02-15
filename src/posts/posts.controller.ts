import {
  BadRequestException,
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsGetModel } from 'src/models/posts/PostsGetModel';
import { transformInNumber } from '../helpers/helpers';
import { PostsQueryRepository } from './posts.query-repository';
import { PostCreateInput, PostsService } from './posts.service';
import { HTTP_STATUSES } from '../constants/general/general';
import {
  CommentCreateInput,
  CommentsService,
} from '../comments/comments.service';
import { AuthAdminGuard } from '../guards/auth-admin.guard';
import { CommentsGetModel } from '../models/comments/CommentsGetModel';
import { AuthUserGuard } from '../guards/auth-user.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtService } from '../jwt/jwt.service';
import { AuthInfoUserGuard } from '../guards/auth-info-user.guard';

@SkipThrottle()
@Controller('posts')
export class PostsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsService: CommentsService,
    protected postsService: PostsService,
    protected jwtService: JwtService,
  ) {}

  @Get()
  async getPosts(@Query() data: PostsGetModel) {
    const {
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = data;
    return await this.postsQueryRepository.getPosts(
      transformInNumber(pageNumber, 1),
      transformInNumber(pageSize, 10),
      sortBy,
      sortDirection,
    );
  }

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    const searchPost = await this.postsQueryRepository.getPostById(id);

    if (!searchPost) {
      throw new NotFoundException();
    }
    return searchPost;
  }

  @UseGuards(AuthAdminGuard)
  @Post()
  async createPost(@Body() data: PostCreateInput) {
    const createdPost = await this.postsService.createPost(data);

    if (!createdPost) {
      throw new BadRequestException([
        {
          field: 'blogId',
          message: "Blog doesn't exist!",
        },
      ]);
    }

    return createdPost;
  }

  @UseGuards(AuthAdminGuard)
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Delete('/:id')
  async deletePost(@Param('id') id: string) {
    const isDeletedPost = await this.postsService.deletePostById(id);

    if (!isDeletedPost) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthAdminGuard)
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Put('/:id')
  async updatePost(@Param('id') id: string, @Body() data: PostCreateInput) {
    const isUpdatedPost = await this.postsService.updatePostById(id, data);

    if (!isUpdatedPost) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthUserGuard)
  @Post('/:id/comments')
  async createCommentForPost(
    @Param('id') postId: string,
    @Body() data: CommentCreateInput,
    @Req() req: Request,
  ) {
    const { content } = data;

    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    const { id: userId, login: userLogin } = req.user;
    const comment = await this.commentsService.createComment(
      content,
      userId,
      userLogin,
      postId,
    );

    if (!comment) {
      throw new BadRequestException({
        field: 'field !!!',
        message: 'unknown error',
      });
    }

    return comment;
  }

  @UseGuards(AuthInfoUserGuard)
  @Get('/:id/comments')
  async getCommentsForPost(
    @Param('id') postId: string,
    @Query() data: CommentsGetModel,
    @Req() req: Request,
  ) {
    const {
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = data;

    const { id: userId } = req.user || {};

    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    return await this.postsService.getCommentsForPost(
      {
        postId,
        pageNumber: transformInNumber(pageNumber, 1),
        pageSize: transformInNumber(pageSize, 10),
        sortBy,
        sortDirection,
      },
      userId,
      'commentsLikes',
    );
  }
}
