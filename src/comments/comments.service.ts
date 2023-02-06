import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { Comment } from './dto';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserLikes,
  UserLikesDocument,
} from '../userLikes/schema/userLike.schema';
import { Model } from 'mongoose';
import { LIKE_STATUSES } from '../constants/general/general';
import { CommentViewModelType } from '../models/comments/CommentsViewModel';
import { UserLikesRepository } from '../userLikes/userLikes.repository';
import { v4 as uuidv4 } from 'uuid';

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
  ) {}

  async createComment(
    content: string,
    userId: string,
    userLogin: string,
    postId: string,
  ): Promise<CommentViewModelType | boolean> {
    const newComment = new Comment(content, userId, userLogin, postId);
    const newLike = new this.userLikes({
      id: uuidv4(),
      documentId: newComment.id,
      senderId: userId,
      senderLogin: userLogin,
      likeStatus: LIKE_STATUSES.NONE,
    });
    try {
      await Promise.all([
        this.commentsRepository.createCommentForPost(newComment),
        newLike.save(),
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
        this.userLikesRepository.deleteLike(commentId, userId),
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

  async updateLikeComment(
    commentId: string,
    likeStatus: LIKE_STATUSES,
    userId: string,
    userLogin: string,
  ): Promise<boolean> {
    const userComment = await this.userLikes.findOne({
      senderId: userId,
      documentId: commentId,
    });

    try {
      if (userComment) {
        userComment.likeStatus = likeStatus;
        await userComment.save();
      } else {
        const newLike = new this.userLikes({
          id: uuidv4(),
          documentId: commentId,
          senderId: userId,
          senderLogin: userLogin,
          likeStatus: likeStatus,
        });
        await newLike.save();
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
