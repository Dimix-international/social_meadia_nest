import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.query-repository';
import {
  UserCreateInput,
  UserResendingInput,
  UserService,
} from '../users/users.service';
import { Request, Response } from 'express';
import { EmailsService } from '../emails/emails.service';
import { AuthService } from './auth.service';
import { UserLoginModel } from '../models/auth/UserLoginModel';
import { HTTP_STATUSES } from '../constants/general/general';
import { AuthQueryRepository } from './auth.query-repository';
import { AuthAdminGuard } from '../auth-admin.guard';
import { JwtService } from '../jwt/jwt.service';

@Controller('auth')
export class AuthRouterController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected authService: AuthService,
    protected authQueryRepository: AuthQueryRepository,
    protected userService: UserService,
    protected emailsService: EmailsService,
    protected jwtService: JwtService,
  ) {}

  @Post('/login')
  @HttpCode(HTTP_STATUSES.OK_200)
  async login(@Body() data: UserLoginModel, @Res() res: Response) {
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
    const { accessToken, refreshToken } =
      await this.authService.checkCredentials(password, user.password, { id });

    if (!accessToken || !refreshToken) {
      throw new BadRequestException();
    }

    await this.authService.saveToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true, // для https
    });

    return accessToken;
  }

  @Post('/logout')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const isCorrectToken = await this.authQueryRepository.getUserIdByToken(
      refreshToken,
    );

    if (!isCorrectToken) {
      throw new UnauthorizedException();
    }

    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
  }

  @Post('/refresh-token')
  @HttpCode(HTTP_STATUSES.OK_200)
  async refreshToken(@Req() req: Request) {
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userId = await this.jwtService.validateRefreshToken(refreshToken);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const { refreshToken: newRefreshToken, accessToken } =
      await this.jwtService.createJWT({
        id: userId,
      });

    await this.authService.saveToken(userId, newRefreshToken);

    return accessToken;
  }

  @Post('/registration')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
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
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Email was not sent!',
        },
      ]);
    }
  }

  @Post('/registration-confirmation')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async activation(@Body('code') code: string) {
    const user = await this.usersQueryRepository.getUserByActivatedCode(code);
    if (!user) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'User not found!',
        },
      ]);
    }
    console.log('user', user);
    if (user.isActivated) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'User was activated!',
        },
      ]);
    }

    const isWasActivatedUser = await this.userService.activateUser(user.id);

    if (!isWasActivatedUser) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'User was not activated!',
        },
      ]);
    }
  }

  @Post('/registration-email-resending')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async resendingEmailRegistration(@Body() data: UserResendingInput) {
    const { email } = data;

    const user = await this.usersQueryRepository.getUserByEmailLogin(email);

    if (!user) {
      throw new BadRequestException([
        {
          field: 'email',
          message: 'Email not found!',
        },
      ]);
    }

    if (user.isActivated) {
      throw new BadRequestException([
        {
          field: 'email',
          message: 'Email was activated!',
        },
      ]);
    }

    if (user.countSendEmailsActivated > 10) {
      throw new BadRequestException([
        {
          field: 'email',
          message: 'Check correctness your email address!',
        },
      ]);
    }

    const code = await this.userService.createNewActivatedCode(user.id);

    if (!code) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Something error!',
        },
      ]);
    }

    try {
      await this.emailsService.sendEmailConfirmationRegistration(email, code);
      await this.userService.updateCountSendEmails(user.id);
    } catch {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Something error!',
        },
      ]);
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('/me')
  async authMe(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    const userId = await this.authQueryRepository.getUserIdByToken(
      refreshToken,
    );

    const { email, login } = await this.usersQueryRepository.getUserById(
      userId,
    );

    return {
      email,
      login,
      userId,
    };
  }
}
