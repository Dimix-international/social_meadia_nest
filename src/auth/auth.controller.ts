import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
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
import { JwtService } from '../jwt/jwt.service';
import { AuthUserGuard } from '../guards/auth-user.guard';
import { Cookies } from '../decorators/params/cookies.decorator';
import { UserAgent } from '../decorators/params/user-agent.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { AcceptNewPassword } from '../models/auth/AcceptNewPassword';

@Controller('auth')
export class AuthRouterController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected authService: AuthService,
    protected userService: UserService,
    protected emailsService: EmailsService,
    protected jwtService: JwtService,
  ) {}

  @Post('/login')
  @HttpCode(HTTP_STATUSES.OK_200)
  async login(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Body() data: UserLoginModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { loginOrEmail, password } = data;

    const user = await this.usersQueryRepository.getUserByEmailLogin(
      loginOrEmail,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const { id } = user;
    const isRightData = await this.authService.checkCredentials(
      password,
      user.password,
    );

    if (!isRightData) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.authService.saveDevice({
      userId: id,
      deviceTitle: userAgent,
      ipAddress: ip,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // для https
    });

    return { accessToken };
  }

  @SkipThrottle()
  @Post('/logout')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async logout(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Cookies('refreshToken') refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenInfo = await this.authService.checkCorrectToken(refreshToken);

    const isCorrectDevice = this.authService.checkCorrectDeviceInfo(
      tokenInfo,
      ip,
      userAgent,
    );

    if (!isCorrectDevice) {
      throw new UnauthorizedException();
    }

    await this.authService.logout(tokenInfo.deviceId);
    res.clearCookie('refreshToken');
  }

  @SkipThrottle()
  @Post('/refresh-token')
  @HttpCode(HTTP_STATUSES.OK_200)
  async refreshToken(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Cookies('refreshToken') refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenInfo = await this.authService.checkCorrectToken(refreshToken);
    const isCorrectDevice = this.authService.checkCorrectDeviceInfo(
      tokenInfo,
      ip,
      userAgent,
    );

    if (!isCorrectDevice) {
      throw new UnauthorizedException();
    }

    const { deviceId, userId } = tokenInfo;

    const { refreshToken: newRefreshToken, accessToken } =
      await this.jwtService.createJWT({
        deviceId,
        userId,
      });

    await this.authService.updateDeviceToken(deviceId, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true, // для https
    });

    return { accessToken };
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

  @UseGuards(AuthUserGuard)
  @Get('/me')
  async authMe(@Req() req: Request) {
    const { id: userId } = req.user;

    const { email, login } = await this.usersQueryRepository.getUserById(
      userId,
    );

    return {
      email,
      login,
      userId,
    };
  }

  @Post('/password-recovery')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async recoveryPassword(@Body() data: UserResendingInput) {
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
    console.log('user', user);
    const code = await this.userService.createNewActivatedCode(user.id);
    console.log('code', code);

    if (!code) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Something error!',
        },
      ]);
    }

    try {
      await this.emailsService.recoveryPassword(email, code);
    } catch {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Something error!',
        },
      ]);
    }
  }

  @Post('/new-password')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async acceptNewPassword(@Body() data: AcceptNewPassword) {
    const { newPassword, recoveryCode } = data;
    const user = await this.usersQueryRepository.getUserByActivatedCode(
      recoveryCode,
    );

    if (!user) {
      throw new BadRequestException([
        {
          field: 'recoveryCode',
          message: 'RecoveryCode not found!',
        },
      ]);
    }
    if (user.isActivated) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Code was activated!',
        },
      ]);
    }

    const isUpdated = await this.userService.setNewPassword(
      user.id,
      newPassword,
    );

    if (!isUpdated) {
      throw new BadRequestException([
        {
          field: 'password',
          message: 'Something error!',
        },
      ]);
    }
  }
}
