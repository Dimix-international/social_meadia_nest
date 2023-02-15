import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserLikes,
  UserLikesDocument,
  UserLikesType,
} from './schema/userLike.schema';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Like } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserLikesRepository {
  constructor(
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
  ) {}

  async createLike(data: CreateLikeType): Promise<boolean> {
    const { like, type } = data;
    const { senderId, senderLogin, ...restLike } = like;
    const userLikes = new this.userLikes({
      senderId,
      senderLogin,
      commentsLikes: [],
      postsLikes: [],
    });
    userLikes[type].push(restLike);
    await userLikes.save();
    return true;
  }

  async deleteLike(data: DeleteLikeType): Promise<DeleteResult> {
    const { type, senderId, documentId } = data;
    return this.userLikes.deleteOne({
      senderId,
      [type]: {
        $elemMatch: {
          documentId,
        },
      },
    });
  }
}

type CreateLikeType = {
  like: Like;
  type: UserLikesType;
};

type DeleteLikeType = {
  type: UserLikesType;
  documentId: string;
  senderId: string;
};
