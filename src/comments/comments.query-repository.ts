import { Injectable } from '@nestjs/common';
import { getPagesCount, getSkip } from '../helpers/helpers';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment-nest.schema';
import { Model } from 'mongoose';
import { LIKE_STATUSES } from '../constants/general/general';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async getComments({
    postId,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: CommentForPostType): Promise<CommentsType> {
    /*    const [items, totalCount] = await Promise.all([
      CommentsCollection.find({ postId }, { projection: { _id: 0, postId: 0 } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .limit(pageSize)
        .toArray(),
      CommentsCollection.countDocuments({ postId }),
    ]);*/

    const [items, totalCount] = await Promise.all([
      this.commentModel
        .find({ postId })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .limit(pageSize)
        .select('-_id -updatedAt')
        .lean(),
      this.commentModel.find({ postId }).countDocuments(),
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
    return this.commentModel.findOne({ id }).select('-_id -updatedAt').lean();
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
  likeStatus: LIKE_STATUSES;
};

export type CommentForPostType = {
  postId: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
