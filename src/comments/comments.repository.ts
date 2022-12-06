import { Injectable } from '@nestjs/common';
import { CommentsCollection } from '../db';

@Injectable()
export class CommentsRepository {
  async createCommentForPost(data: CreateCommentType) {
    return await CommentsCollection.insertOne(data);
  }
  async deleteComment(id: string) {
    return await CommentsCollection.deleteOne({ id });
  }
  async updateComment(id: string, content: string) {
    return await CommentsCollection.updateOne(
      { id },
      {
        $set: {
          content,
        },
      },
    );
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
