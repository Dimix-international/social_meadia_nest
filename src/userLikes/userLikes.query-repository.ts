import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserLikes,
  UserLikesDocument,
  UserLikesType,
} from './schema/userLike.schema';
import { Model } from 'mongoose';
import { LIKE_STATUSES } from '../constants/general/general';

@Injectable()
export class UserLikesQueryRepository {
  constructor(
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
  ) {}

  async getUserLikeStatus(data: GetLikeType): Promise<GetUserLikesInfoType> {
    const { type, senderId, documentId } = data;
    return this.userLikes
      .findOne({
        senderId,
        [type]: {
          $elemMatch: {
            documentId: documentId,
          },
        },
      })
      .lean();
  }

  async getLikesInfo(data: GetLikeInfoType): Promise<LikeInfoType> {
    const { type, documentId } = data;
    const [likesCount, dislikesCount] = await Promise.all([
      this.userLikes
        .find({
          [type]: {
            $elemMatch: {
              documentId,
              likeStatus: LIKE_STATUSES.LIKE,
            },
          },
        })
        .countDocuments(),
      this.userLikes
        .find({
          [type]: {
            $elemMatch: {
              documentId,
              likeStatus: LIKE_STATUSES.DISLIKE,
            },
          },
        })
        .countDocuments(),
    ]);

    return {
      documentId,
      likesCount,
      dislikesCount,
    };
  }
}

type GetLikeInfoType = {
  documentId: string;
  type: UserLikesType;
};

type GetLikeType = GetLikeInfoType & {
  senderId: string;
};

export type UserLikeInfoType = {
  id: string;
  documentId: string;
  likeStatus: LIKE_STATUSES;
  createdAt: Date;
};

export type GetUserLikesInfoType = {
  senderId: string;
  senderLogin: string;
  commentsLikes: UserLikeInfoType[];
  postsLikes: UserLikeInfoType[];
};

export type LikeInfoType = {
  documentId: string;
  likesCount: number;
  dislikesCount: number;
};
