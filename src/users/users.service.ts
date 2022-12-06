import { User } from './classes';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { v4 as uuidv4 } from 'uuid';
import { HASH_SALT_ROUNDS } from '../constants/general/general';
import bcrypt from 'bcrypt';
import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator';

export class UserCreateInput {
  @IsNotEmpty({ message: 'This field is required!' })
  @MinLength(3, { message: 'Min 3 symbols!' })
  @MaxLength(10, { message: 'Max 10 symbols!' })
  login: string;

  @IsNotEmpty({ message: 'This field is required!' })
  @MinLength(3, { message: 'Min 6 symbols!' })
  @MaxLength(20, { message: 'Max 20 symbols!' })
  password: string;

  @IsNotEmpty({ message: 'This field is required!' })
  @IsEmail({ message: 'Incorrect email format!' })
  email: string;
}

export class UserResendingInput {
  @IsNotEmpty({ message: 'This field is required!' })
  @IsEmail({ message: 'Incorrect email format!' })
  email: string;
}

@Injectable()
export class UserService {
  constructor(protected usersRepository: UsersRepository) {}

  async deleteUserById(id: string): Promise<boolean> {
    const { deletedCount } = await this.usersRepository.deleteUser(id);
    return !!deletedCount;
  }

  async createUser(login: string, password: string, email: string) {
    const hashPassword = await this._generateHash(password);

    const newUser = new User(login, hashPassword, email);

    await this.usersRepository.createUser(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
      activationCode: newUser.activationCode,
      countSendEmailsActivated: newUser.countSendEmailsActivated,
    };
  }

  async activateUser(userId: string): Promise<boolean> {
    const { matchedCount } = await this.usersRepository.activateUser(userId);
    return !!matchedCount;
  }

  async updateCountSendEmails(userId: string): Promise<boolean> {
    const { matchedCount } = await this.usersRepository.updateCountSendEmails(
      userId,
    );
    return !!matchedCount;
  }

  async createNewActivatedCode(userId: string): Promise<string | null> {
    const code = uuidv4();
    const { matchedCount } = await this.usersRepository.createNewActivatedCode(
      userId,
      code,
    );
    return !!matchedCount ? code : null;
  }

  async _generateHash(password: string) {
    return await bcrypt.hash(password, HASH_SALT_ROUNDS);
  }
}
