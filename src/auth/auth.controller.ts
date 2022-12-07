import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.query-repository';
import {
  UserCreateInput,
  UserResendingInput,
  UserService,
} from '../users/users.service';
import { EmailsService } from '../emails/emails.service';
import { AuthService } from './auth.service';
import { UserLoginModel } from '../models/auth/UserLoginModel';
import { HTTP_STATUSES } from '../constants/general/general';

@Controller('auth')
export class AuthRouterController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected authService: AuthService,
    protected userService: UserService,
    protected emailsService: EmailsService,
  ) {}

  @Post('/login')
  @HttpCode(HTTP_STATUSES.OK_200)
  async login(@Body() data: UserLoginModel) {
    const { loginOrEmail, password } = data;

    const user = await this.usersQueryRepository.getUserByEmailLogin(
      loginOrEmail,
    );

    if (!user) {
      throw new BadRequestException({
        field: 'loginOrEmail',
        message: 'User not found!',
      });
    }
    const { id } = user;
    const userInfo = await this.authService.checkCredentials(
      password,
      user.password,
      { id },
    );

    if (!userInfo) {
      throw new BadRequestException();
    }

    return userInfo;
  }

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Post('/registration')
  async registration(@Body() data: UserCreateInput) {
    const { login, password, email } = data;

    const [isExistEmail, isExistLogin] = await Promise.all([
      this.usersQueryRepository.getUserByEmailLogin(email),
      this.usersQueryRepository.getUserByEmailLogin(login),
    ]);

    if (isExistEmail || isExistLogin) {
      const errors = [];

      if (isExistEmail) {
        errors.push({
          field: 'email',
          message: 'Email is already exist!',
        });
      }

      if (isExistLogin) {
        errors.push({
          field: 'login',
          message: 'Login is already exist!',
        });
      }

      throw new BadRequestException(errors);
    }

    const createdUser = await this.userService.createUser(
      login,
      password,
      email,
    );

    if (!createdUser) {
      throw new NotFoundException();
    }

    try {
      await this.emailsService.sendEmailConfirmationRegistration(
        email,
        createdUser.activationCode,
      );
      await this.userService.updateCountSendEmails(createdUser.id);
    } catch {
      await this.userService.deleteUserById(createdUser.id);
      throw new NotFoundException();
    }
  }

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Post('/registration-confirmation')
  async activation(@Body('code') code: string) {
    console.log('code', code);
    const user = await this.usersQueryRepository.getUserByActivatedCode(code);
    console.log('user', user);
    if (!user) {
      throw new BadRequestException({
        field: 'code',
        message: 'User not found!',
      });
    }

    if (user.isActivated) {
      throw new BadRequestException({
        field: 'code',
        message: 'User was activated!',
      });
    }

    const isWasActivatedUser = await this.userService.activateUser(user.id);

    if (!isWasActivatedUser) {
      throw new BadRequestException({
        field: 'code',
        message: 'User was not activated!',
      });
    }
  }

  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  @Post('/registration-email-resending')
  async resendingEmailRegistration(@Body() data: UserResendingInput) {
    const { email } = data;

    const user = await this.usersQueryRepository.getUserByEmailLogin(email);

    if (!user) {
      throw new BadRequestException({
        field: 'code',
        message: 'User not found!',
      });
    }

    if (user.isActivated) {
      throw new BadRequestException({
        field: 'code',
        message: 'User was activated!',
      });
    }

    if (user.countSendEmailsActivated > 10) {
      throw new BadRequestException({
        field: 'code',
        message: 'Check correctness your email address!',
      });
    }

    const code = await this.userService.createNewActivatedCode(user.id);

    if (!code) {
      throw new BadRequestException({
        field: 'code',
        message: 'Something error!',
      });
    }

    try {
      await this.emailsService.sendEmailConfirmationRegistration(email, code);
      await this.userService.updateCountSendEmails(user.id);
    } catch {
      throw new BadRequestException({
        field: 'code',
        message: 'Something error!',
      });
    }
  }
}
