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
  UseGuards,
} from '@nestjs/common';
import { UsersGetModel } from '../models/users/UsersGetModel';
import { UsersQueryRepository } from './users.query-repository';
import { UserCreateInput, UserService } from './users.service';
import { transformInNumber } from '../helpers/helpers';
import { HTTP_STATUSES } from '../constants/general/general';
import { AuthAdminGuard } from '../guards/auth-admin.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('users')
export class UserController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected userService: UserService,
  ) {}

  @UseGuards(AuthAdminGuard)
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

  @UseGuards(AuthAdminGuard)
  @Post()
  async createUser(@Body() data: UserCreateInput) {
    const { login, email, password } = data;
    const { id, createdAt } = await this.userService.createUser(
      login,
      password,
      email,
    );
    return {
      id,
      login,
      email,
      createdAt,
    };
  }

  @UseGuards(AuthAdminGuard)
  @Delete('/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
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
