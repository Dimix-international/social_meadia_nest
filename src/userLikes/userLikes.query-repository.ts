import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserLikes, UserLikesDocument } from './schema/userLike.schema';
import { Model } from 'mongoose';
import { LIKE_STATUSES } from '../constants/general/general';

@Injectable()
export class UserLikesQueryRepository {
  constructor(
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
  ) {}

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

    return {
      documentId,
      likesCount,
      dislikesCount,
    };
  }
}

export type LikeInfoType = {
  documentId: string;
  likesCount: number;
  dislikesCount: number;
};
