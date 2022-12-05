import { BlogsCollection } from '../db';
import { Injectable } from '@nestjs/common';
import { getPagesCount, getSkip } from '../helpers/helpers';

@Injectable()
export class BlogsQueryRepository {
  async getBlogs(
    searchNameTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<BlogsType> {
    const result = await BlogsCollection.aggregate([
      {
        $facet: {
          items: [
            {
              $match: {
                name: searchNameTerm
                  ? { $regex: new RegExp(searchNameTerm, 'i') }
                  : { $ne: null },
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
                name: searchNameTerm
                  ? { $regex: new RegExp(searchNameTerm, 'i') }
                  : { $ne: null },
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
    const { totalCount } = count[0] || {};

    return {
      pagesCount: getPagesCount(totalCount || 0, pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount || 0,
      items: items as BlogType[],
    };
  }

  async getBlogById(id: string): Promise<BlogType | null> {
    return await BlogsCollection.findOne({ id }, { projection: { _id: 0 } });
  }
}

export type BlogsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogType[];
};

type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};
