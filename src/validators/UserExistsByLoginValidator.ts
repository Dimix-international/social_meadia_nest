import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersQueryRepository } from '../users/users.query-repository';

@ValidatorConstraint({ name: 'UserExistsByLogin', async: true })
export class UserExistsByLoginValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async validate(login: string) {
    const user = await this.usersQueryRepository.getUserByEmailLogin(login);
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Something connection error!';
  }
}
