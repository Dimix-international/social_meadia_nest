import { Injectable } from '@nestjs/common';
import { getPagesCount, getSkip } from '../helpers/helpers';
import { PostModel } from './schema/schemaType';

@Injectable()
export class PostsQueryRepository {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PostsType> {
    /*    const [result, totalCount] = await Promise.all([
      PostsCollection.find({}, { projection: { _id: 0 } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .limit(pageSize)
        .toArray(),
      PostsCollection.countDocuments(),
    ]);*/

    const [result, totalCount] = await Promise.all([
      PostModel.find({})
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .select('-_id -__v -updatedAt')
        .lean(),
      PostModel.find({}).countDocuments(),
    ]);

    return {
      pagesCount: getPagesCount(totalCount || 0, pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCount || 0,
      items: result,
    };
  }
  async getPostById(id: string): Promise<PostType | null> {
    const post = await PostModel.findOne({ id }).select('-_id -__v -updatedAt');
    return post;
  }
  async getPostsForBlog(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    blogId: string,
  ): Promise<PostsType> {
    /*    const result = PostsCollection.aggregate([
      {
        $facet: {
          items: [
            {
              $match: {
                blogId: blogId,
              },
            },
            {
              $sort: {
                [sortBy]: sortDirection === 'asc' ? 1 : -1,
              },
            },
            {
              $skip: getSkip(pageNumber, pageSize),
            },
            {
              $limit: pageSize,
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          count: [
            {
              $match: {
                blogId: blogId,
              },
            },
            {
              $count: 'totalCount',
            },
          ],
        },
      },
    ]);
    const aggregateResult = await result.toArray();

    const { items, count } = aggregateResult[0];
    const { totalCount } = count[0] || {};*/

    const [items, totalCount] = await Promise.all([
      PostModel.find({
        $match: {
          blogId: blogId,
        },
      })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(getSkip(pageNumber, pageSize))
        .select('-_id -__v -updatedAt')
        .lean(),
      PostModel.find({
        $match: {
          blogId: blogId,
        },
      }).countDocuments(),
    ]);

    return {
      pagesCount: getPagesCount(totalCount || 0, pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCount || 0,
      items: items,
    };
  }
}

export type PostsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostType[];
};

type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};
