import { Injectable } from '@nestjs/common';
import { getPagesCount, getSkip } from '../helpers/helpers';
import { UserModel } from './schema/user-schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user-nest.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ): Promise<UsersType> {
    const aggregateResult = await this.userModel.aggregate([
      {
        $facet: {
          items: [
            {
              $match: {
                $or: [
                  {
                    login: searchLoginTerm
                      ? { $regex: new RegExp(searchLoginTerm, 'i') }
                      : { $ne: null },
                  },
                  {
                    email: searchEmailTerm
                      ? { $regex: new RegExp(searchEmailTerm, 'i') }
                      : { $ne: null },
                  },
                ],
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
                password: 0,
                activationLink: 0,
                isActivated: 0,
                updatedAt: 0,
                __v: 0,
                activationCode: 0,
                countSendEmailsActivated: 0,
              },
            },
          ],
          count: [
            {
              $match: {
                $or: [
                  {
                    login: searchLoginTerm
                      ? { $regex: new RegExp(searchLoginTerm, 'i') }
                      : { $ne: null },
                  },
                  {
                    email: searchEmailTerm
                      ? { $regex: new RegExp(searchEmailTerm, 'i') }
                      : { $ne: null },
                  },
                ],
              },
            },
            {
              $count: 'totalCount',
            },
          ],
        },
      },
    ]);
    const { items, count } = aggregateResult[0] || {};
    const { totalCount } = count[0] || {};

    return {
      pagesCount: getPagesCount(totalCount || 0, pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount || 0,
      items,
    };
  }
  async getUserById(id: string): Promise<UserType | null> {
    /*    return await UsersCollection.findOne(
      { id },
      {
        projection: {
          _id: 0,
          password: 0,
          activationLink: 0,
          isActivated: 0,
          countSendEmailsActivated: 0,
        },
      },
    );*/
    return this.userModel
      .findOne({ id })
      .select(
        '-id -password -activationLink -isActivated -countSendEmailsActivated',
      )
      .lean();
  }
  async getUserByEmailLogin(emailOrLogin: string): Promise<UserType | null> {
    return this.userModel
      .findOne({
        $or: [{ login: emailOrLogin }, { email: emailOrLogin }],
      })
      .select('-id ')
      .lean();
  }

  async getUserByActivatedCode(
    activationCode: string,
  ): Promise<UserType | null> {
    return this.userModel.findOne({ activationCode }).lean();
  }
}

export type UsersType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetUserType[];
};

export type GetUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type UserType = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  activationCode: string;
  isActivated: boolean;
  countSendEmailsActivated: number;
};
