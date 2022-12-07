import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersGetModel } from '../models/users/UsersGetModel';
import { UsersQueryRepository } from './users.query-repository';
import { UserCreateInput, UserService } from './users.service';
import { transformInNumber } from '../helpers/helpers';
import { HTTP_STATUSES } from '../constants/general/general';

@Controller('users')
export class UserController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected userService: UserService,
  ) {}

  @Get()
  async getUsers(@Query() data: UsersGetModel) {
    const {
      pageNumber,
      pageSize,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      searchLoginTerm = null,
      searchEmailTerm = null,
    } = data;

    return await this.usersQueryRepository.getUsers(
      transformInNumber(pageNumber, 1),
      transformInNumber(pageSize, 10),
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    );
  }

  @Post()
  async createUser(@Body() data: UserCreateInput) {
    const { login, email, password } = data;
    return await this.userService.createUser(login, password, email);
  }

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const searchUser = await this.usersQueryRepository.getUserById(id);

    if (!searchUser) {
      throw new NotFoundException();
    }

    const isDeletedPost = await this.userService.deleteUserById(id);

    if (!isDeletedPost) {
      throw new NotFoundException();
    }
  }
}
