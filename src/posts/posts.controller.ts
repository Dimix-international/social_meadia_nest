import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostsGetModel } from 'src/models/posts/PostsGetModel';
import { transformInNumber } from '../helpers/helpers';
import { PostsQueryRepository } from './posts.query-repository';
import { PostCreateInput, PostsService } from './posts.service';
import { HTTP_STATUSES } from '../constants/general/general';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    //  @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    //  @inject(CommentsService) protected commentsService: CommentsService,
    protected postsService: PostsService,
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

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const searchPost = await this.postsQueryRepository.getPostById(id);

    if (!searchPost) {
      throw new NotFoundException();
    }
    return searchPost;
  }

  @Post()
  async createPost(@Body() data: PostCreateInput) {
    const createdPost = await this.postsService.createPost(data);

    if (!createdPost) {
      throw new BadRequestException();
    }

    return createdPost;
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @Res() res: Response) {
    const isDeletedPost = await this.postsService.deletePostById(id);

    if (!isDeletedPost) {
      throw new NotFoundException();
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: PostCreateInput,
    @Res() res: Response,
  ) {
    const isUpdatedPost = await this.postsService.updatePostById(id, data);

    if (!isUpdatedPost) {
      throw new NotFoundException();
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  /*  async createCommentForPost(
    req: RequestWithParamsBody<PostsURIParamsModel, PostsCreateComment>,
    res: Response<CommentViewModelType>,
  ) {
    const { id: postId } = req.params;
    const { content } = req.body;

    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    const { id: userId, login: userLogin } = req.user;
    const newComment = await this.commentsService.createComment(
      content,
      userId,
      userLogin,
      postId,
    );
    res.status(HTTP_STATUSES.CREATED_201).send(newComment);
  }

  async getCommentsForPost(
    req: RequestWithQueryParamsAndParams<PostsURIParamsModel, CommentsGetModel>,
    res: Response<CommentsViewModel>,
  ) {
    const { id: postId } = req.params;
    const {
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = req.query;

    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    const comments = await this.commentsQueryRepository.getComments(
      postId,
      transformInNumber(pageNumber, 1),
      transformInNumber(pageSize, 10),
      sortBy,
      sortDirection,
    );

    res.status(HTTP_STATUSES.OK_200).send(comments);
  }*/
}
