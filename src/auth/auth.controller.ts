import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
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
import { Response } from 'express';
import { HTTP_STATUSES } from '../constants/general/general';

@Controller('auth')
export class AuthRouterController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected authService: AuthService,
    protected userService: UserService,
    protected emailsService: EmailsService,
  ) {}

  @Post('login')
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

  @Post('registration')
  async registration(@Body() data: UserCreateInput, @Res() res: Response) {
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
      throw new BadRequestException();
    }

    try {
      await this.emailsService.sendEmailConfirmationRegistration(
        email,
        createdUser.activationCode,
      );
      await this.userService.updateCountSendEmails(createdUser.id);
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch {
      await this.userService.deleteUserById(createdUser.id);
      throw new BadRequestException();
    }
  }

  @Post('registration-confirmation')
  async activation(@Body('code') code: string, @Res() res: Response) {
    const user = await this.usersQueryRepository.getUserByActivatedCode(code);

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

    const isActivatedUser = await this.userService.activateUser(user.id);

    if (!isActivatedUser) {
      throw new BadRequestException();
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }

  @Post('registration-email-resending')
  async resendingEmailRegistration(
    @Body() data: UserResendingInput,
    @Res() res: Response,
  ) {
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
      throw new BadRequestException();
    }

    try {
      await this.emailsService.sendEmailConfirmationRegistration(email, code);
      await this.userService.updateCountSendEmails(user.id);
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch {
      throw new BadRequestException();
    }
  }
}
