import { Injectable } from '@nestjs/common';
import { getPagesCount, getSkip } from '../helpers/helpers';
import { CommentModel } from './schema/comment-schema';

@Injectable()
export class CommentsQueryRepository {
  async getComments(
    postId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<CommentsType> {
    /*    const [items, totalCount] = await Promise.all([
      CommentsCollection.find({ postId }, { projection: { _id: 0, postId: 0 } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .limit(pageSize)
        .toArray(),
      CommentsCollection.countDocuments({ postId }),
    ]);*/

    const [items, totalCount] = await Promise.all([
      CommentModel.find({ postId })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .select('-_id -__v -updatedAt')
        .lean(),
      CommentModel.find({ postId }).countDocuments(),
    ]);

    return {
      pagesCount: getPagesCount(totalCount || 0, pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCount || 0,
      items,
    };
  }

  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await CommentModel.findOne({ id }).select(
      '-_id -__v -updatedAt',
    );
    return comment;
  }
}

type CommentsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentType[];
};

type CommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};
