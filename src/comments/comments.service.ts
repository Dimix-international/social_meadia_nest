import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { Comment } from './dto';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserLikes,
  UserLikesDocument,
  UserLikesType,
} from '../userLikes/schema/userLike.schema';
import { Model } from 'mongoose';
import { LIKE_STATUSES } from '../constants/general/general';
import { CommentViewModelType } from '../models/comments/CommentsViewModel';
import { UserLikesRepository } from '../userLikes/userLikes.repository';
import { Like } from '../userLikes/dto';
import { UserLikesService } from '../userLikes/userLikes.service';

export class CommentCreateInput {
  @IsNotEmpty({ message: 'This field is required!' })
  @MinLength(20, { message: 'Min 20 symbols!' })
  @MaxLength(300, { message: 'Max 300 symbols!' })
  content: string;
}

export class UpdateLikeStatus {
  @Matches(new RegExp(`^${Object.values(LIKE_STATUSES).join('$|')}`), {
    message: 'Incorrect format likeStatus!',
  })
  likeStatus: LIKE_STATUSES;
}

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
    protected userLikesRepository: UserLikesRepository,
    protected userLikesService: UserLikesService,
  ) {}

  async createComment(
    content: string,
    userId: string,
    userLogin: string,
    postId: string,
  ): Promise<CommentViewModelType | boolean> {
    const newComment = new Comment(content, userId, userLogin, postId);

    try {
      await Promise.all([
        this.userLikesService.createLikeDocument({
          type: 'commentsLikes',
          senderLogin: userLogin,
          senderId: userId,
          documentId: newComment.id,
        }),
        this.commentsRepository.createCommentForPost(newComment),
      ]);
      return {
        id: newComment.id,
        content,
        commentatorInfo: {
          userId,
          userLogin,
        },
        createdAt: newComment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LIKE_STATUSES.NONE,
        },
      };
    } catch (e) {
      return false;
    }
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      const [deletedComment] = await Promise.all([
        this.commentsRepository.deleteComment(commentId),
        this.userLikesRepository.deleteLike({
          documentId: commentId,
          senderId: userId,
          type: 'commentsLikes',
        }),
      ]);
      const { deletedCount } = deletedComment;
      return !!deletedCount;
    } catch (e) {
      return false;
    }
  }

  async updateContentComment(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const { matchedCount } = await this.commentsRepository.updateComment(
      commentId,
      { content },
    );
    return !!matchedCount;
  }
}
