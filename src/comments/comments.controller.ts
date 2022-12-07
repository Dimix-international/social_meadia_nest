import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/users.query-repository';
import { CommentsQueryRepository } from './comments.query-repository';
import { HTTP_STATUSES } from '../constants/general/general';
import { CommentCreateInput, CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentsService: CommentsService,
  ) {}

  @Get('/:id')
  async getComments(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Delete('/:id')
  async deleteComment(@Param('id') commentId: string, @Req() req: Request) {
    const comment = await this.commentsQueryRepository.getCommentById(
      commentId,
    );

    if (!comment) {
      throw new NotFoundException();
    }

    const { id: userId } = req.user;

    const user = await this.usersQueryRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    if (comment.userId !== user.id) {
      throw new ForbiddenException();
    }

    const isDeletedComment = await this.commentsService.deleteComment(
      commentId,
    );

    if (!isDeletedComment) {
      throw new NotFoundException();
    }
  }

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Put('/:id')
  async updateComment(
    @Param('id') commentId: string,
    @Body() data: CommentCreateInput,
    @Req() req: Request,
  ) {
    const comment = await this.commentsQueryRepository.getCommentById(
      commentId,
    );

    if (!comment) {
      throw new NotFoundException();
    }

    const { id: userId } = req.user;

    const user = await this.usersQueryRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    if (comment.userId !== user.id) {
      throw new ForbiddenException();
    }

    const isUpdatedComment = await this.commentsService.updateComment(
      commentId,
      data.content,
    );

    if (!isUpdatedComment) {
      throw new NotFoundException();
    }
  }
}
