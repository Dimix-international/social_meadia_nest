import { Injectable } from '@nestjs/common';
import { getPagesCount, getSkip } from '../helpers/helpers';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment-nest.schema';
import { Model } from 'mongoose';

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
        .select('-_id -updatedAt -postId')
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
    return this.commentModel
      .findOne({ id })
      .select('-_id -updatedAt -postId')
      .lean();
    /*    const [comment] = await this.commentModel.aggregate([
      {
        $match: { id },
      },
      {
        $lookup: {
          from: 'userLikes',
          localField: 'id',
          foreignField: 'documentId',
          pipeline: [
            {
              $match: { likeStatus: LIKE_STATUSES.LIKE },
            },
          ],
          as: 'likesCount',
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          content: 1,
          userId: 1,
          userLogin: 1,
          createdAt: 1,
          'likesInfo.likesCount': { $size: '$likesCount' },
        },
      },
    ]);
    return comment;*/
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

export type CommentForPostType = {
  postId: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
