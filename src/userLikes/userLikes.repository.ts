import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserLikes, UserLikesDocument } from './schema/userLike.schema';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { LIKE_STATUSES } from '../constants/general/general';

@Injectable()
export class UserLikesRepository {
  constructor(
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
  ) {}

  async deleteLike(
    documentId: string,
    senderId: string,
  ): Promise<DeleteResult> {
    return this.userLikes.deleteOne({ documentId, senderId });
  }
  async updateLike(
    documentId: string,
    senderId: string,
    likeStatus: LIKE_STATUSES,
  ): Promise<UpdateResult> {
    return this.userLikes.updateOne({ documentId, senderId }, { likeStatus });
  }
}
