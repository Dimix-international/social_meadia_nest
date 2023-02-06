import { Injectable } from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { UserLikes, UserLikesDocument } from './schema/userLike.schema';
import { Model } from 'mongoose';
import { LIKE_STATUSES } from '../constants/general/general';

@Injectable()
export class UserLikesQueryRepository {
  constructor(
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
  ) {}

  async getUserLikeStatus(
    senderId: string,
    documentId: string,
  ): Promise<UserLikeInfoType> {
    return this.userLikes.findOne({ senderId, documentId }).lean();
  }

  async getLikesInfo(documentId: string): Promise<LikeInfoType> {
    const [likesCount, dislikesCount] = await Promise.all([
      this.userLikes
        .find({
          documentId,
          likeStatus: LIKE_STATUSES.LIKE,
        })
        .countDocuments(),
      this.userLikes
        .find({
          documentId,
          likeStatus: LIKE_STATUSES.DISLIKE,
        })
        .countDocuments(),
    ]);

    // const likesAndDislikes = await this.userLikes.aggregate([
    //   { $match: { documentId, likeStatus: LIKE_STATUSES.LIKE } },
    //   { $group: {} },
    //   { $project: {
    //       _id: 0,
    //       likesCount: '$likes',
    //     },
    //   },
    // ]);

    return {
      documentId,
      likesCount,
      dislikesCount,
    };
  }
}

export type UserLikeInfoType = {
  id: string;
  documentId: string;
  senderId: string;
  senderLogin: string;
  likeStatus: LIKE_STATUSES;
  createdAt: Date;
};

export type LikeInfoType = {
  documentId: string;
  likesCount: number;
  dislikesCount: number;
};
