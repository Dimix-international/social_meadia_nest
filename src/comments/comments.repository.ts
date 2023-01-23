import { Injectable } from '@nestjs/common';
import { CommentModel } from './schema/comment-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment-nest.schema';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';

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
  async updateComment(id: string, content: string): Promise<UpdateResult> {
    return this.commentModel.updateOne({ id }, { content });
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
