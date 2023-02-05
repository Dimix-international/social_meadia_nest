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
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/users.query-repository';
import { CommentsQueryRepository } from './comments.query-repository';
import { HTTP_STATUSES, LIKE_STATUSES } from '../constants/general/general';
import {
  CommentCreateInput,
  CommentsService,
  UpdateLikeStatus,
} from './comments.service';
import { AuthUserGuard } from '../guards/auth-user.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CommentViewModelType } from '../models/comments/CommentsViewModel';
import { UserLikesQueryRepository } from '../userLikes/userLikes.query-repository';

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentsService: CommentsService,
    protected userLikesQueryRepository: UserLikesQueryRepository,
  ) {}

  @Get('/:id')
  async getComment(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<CommentViewModelType> {
    const [comment, userLikesInfo] = await Promise.all([
      await this.commentsQueryRepository.getCommentById(id),
      await this.userLikesQueryRepository.getLikesInfo(id),
    ]);

    const { id: authUserId } = req.user || {};

    if (!comment) {
      throw new NotFoundException();
    }

    const { likeStatus, userLogin, userId, ...restDataComment } = comment;
    return {
      ...restDataComment,
      commentatorInfo: {
        userId,
        userLogin,
      },
      likesInfo: {
        likesCount: userLikesInfo.likesCount,
        dislikesCount: userLikesInfo.dislikesCount,
        myStatus: authUserId ? likeStatus : LIKE_STATUSES.NONE,
      },
    };
  }

  @UseGuards(AuthUserGuard)
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
      user.id,
    );

    if (!isDeletedComment) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthUserGuard)
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

    const isUpdatedComment = await this.commentsService.updateContentComment(
      commentId,
      data.content,
    );

    if (!isUpdatedComment) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthUserGuard)
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Put('/:id/like-status')
  async updateLikeStatus(
    @Param('id') commentId: string,
    @Body() data: UpdateLikeStatus,
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

    return await this.commentsService.updateLikeComment(
      comment.id,
      data.likeStatus,
      userId,
    );
  }
}
