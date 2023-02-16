import { Injectable } from '@nestjs/common';
import { LIKE_STATUSES } from '../constants/general/general';
import {
  UserLikes,
  UserLikesDocument,
  UserLikesType,
} from './schema/userLike.schema';
import { Like } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLikesRepository } from './userLikes.repository';

@Injectable()
export class UserLikesService {
  constructor(
    @InjectModel(UserLikes.name)
    private readonly userLikes: Model<UserLikesDocument>,
    protected userLikesRepository: UserLikesRepository,
  ) {}
  async updateLikeDocument(data: UpdateLikeDocumentType): Promise<boolean> {
    const { type, senderId, senderLogin, likeStatus, documentId } = data;

    const userLiked = await this.userLikes.findOne({
      senderId,
    });

    const saveLikeExistedUse = async () => {
      const likeElementIndex = userLiked[type].findIndex(
        (item) => item.documentId === documentId,
      );

      if (likeElementIndex !== -1) {
        userLiked[type][likeElementIndex].likeStatus = likeStatus;
        await userLiked.save();
      } else {
        const newLike = new Like({
          documentId,
          senderId,
          senderLogin,
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
          documentId,
          senderId,
          senderLogin,
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

  async createLikeDocument(data: CreateLikeDocumentType): Promise<boolean> {
    const { documentId, senderId, senderLogin, type } = data;
    const newLike = new Like({
      documentId,
      senderId,
      senderLogin,
      likeStatus: LIKE_STATUSES.NONE,
    });
    const userLike = await this.userLikes.findOne({
      senderId,
    });

    try {
      if (userLike) {
        userLike[type].push(newLike);
        await userLike.save();
        return true;
      }
      return await this.userLikesRepository.createLike({
        like: newLike,
        type: 'commentsLikes',
      });
    } catch (e) {
      return false;
    }
  }
}

type CreateLikeDocumentType = {
  documentId: string;
  senderId: string;
  senderLogin: string;
  type: UserLikesType;
};

type UpdateLikeDocumentType = CreateLikeDocumentType & {
  likeStatus: LIKE_STATUSES;
};
