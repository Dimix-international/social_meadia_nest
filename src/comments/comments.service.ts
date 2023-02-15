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
import { log } from 'util';

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
    const newLike = new Like({
      documentId: newComment.id,
      senderId: userId,
      senderLogin: userLogin,
      likeStatus: LIKE_STATUSES.NONE,
    });
    const userLike = await this.userLikes.findOne({
      senderId: userId,
    });

    const updateCreateLike = async () => {
      if (userLike) {
        userLike.commentsLikes.push(newLike);
        userLike.save();
        return;
      }
      return this.userLikesRepository.createLike({
        like: newLike,
        type: 'commentsLikes',
      });
    };

    try {
      await Promise.all([
        updateCreateLike(),
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

  async updateLikeDocument(
    commentId: string,
    likeStatus: LIKE_STATUSES,
    userId: string,
    userLogin: string,
    type: UserLikesType,
  ): Promise<boolean> {
    const userLiked = await this.userLikes.findOne({
      senderId: userId,
    });

    console.log('userLiked', userLiked);

    const saveLikeExistedUse = async () => {
      const likeElementIndex = userLiked[type].findIndex(
        (item) => item.documentId === commentId,
      );

      console.log('likeElementIndex', likeElementIndex);

      if (likeElementIndex !== -1) {
        userLiked[type][likeElementIndex].likeStatus = likeStatus;
        await userLiked.save();
      } else {
        const newLike = new Like({
          documentId: commentId,
          senderId: userId,
          senderLogin: userLogin,
          likeStatus,
        });
        userLiked[type].push(newLike);
        await userLiked.save();
      }
    };

    try {
      if (userLiked) {
        await saveLikeExistedUse();
      } else {
        const newLike = new Like({
          documentId: commentId,
          senderId: userId,
          senderLogin: userLogin,
          likeStatus,
        });
        await this.userLikesRepository.createLike({
          like: newLike,
          type,
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
