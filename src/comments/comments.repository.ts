import { Injectable } from '@nestjs/common';
import { CommentModel } from './schema/comment-schema';

@Injectable()
export class CommentsRepository {
  async createCommentForPost(data: CreateCommentType) {
    const createdComment = await CommentModel.create(data);
    return createdComment;
  }
  async deleteComment(id: string) {
    const deletedComment = await CommentModel.deleteOne({ id });
    return deletedComment;
  }
  async updateComment(id: string, content: string) {
    const updatedComment = await CommentModel.updateOne({ id }, { content });
    return updatedComment;
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
