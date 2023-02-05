import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment-nest.schema';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { LIKE_STATUSES } from '../constants/general/general';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async createCommentForPost(data: CreateCommentType) {
    return this.commentModel.create(data);
  }
  async deleteComment(id: string): Promise<DeleteResult> {
    return this.commentModel.deleteOne({ id });
  }
  async updateComment(
    id: string,
    data: UpdateCommentType,
  ): Promise<UpdateResult> {
    return this.commentModel.updateOne({ id }, { ...data });
  }
}

type CreateCommentType = {
  id: string;
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};

type UpdateCommentType = {
  content?: string;
  likeStatus?: LIKE_STATUSES;
};
