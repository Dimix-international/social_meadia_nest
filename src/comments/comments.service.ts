import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { Comment } from './classes';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CommentCreateInput {
  @IsNotEmpty({ message: 'This field is required!' })
  @MinLength(20, { message: 'Min 20 symbols!' })
  @MaxLength(300, { message: 'Max 300 symbols!' })
  content: string;
}

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}

  async createComment(
    content: string,
    userId: string,
    userLogin: string,
    postId: string,
  ) {
    const newComment = new Comment(content, userId, userLogin, postId);

    await this.commentsRepository.createCommentForPost(newComment);

    return {
      id: newComment.id,
      content,
      userId,
      userLogin,
      createdAt: newComment.createdAt,
    };
  }
  async deleteComment(commentId: string): Promise<boolean> {
    const { deletedCount } = await this.commentsRepository.deleteComment(
      commentId,
    );
    return !!deletedCount;
  }
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const { matchedCount } = await this.commentsRepository.updateComment(
      commentId,
      content,
    );
    return !!matchedCount;
  }
}
