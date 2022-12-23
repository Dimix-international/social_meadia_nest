import { registerDecorator, ValidationOptions } from 'class-validator';
import { UserExistsByLoginValidator } from '../../validators/UserExistsByLoginValidator';

export function IsLoginInDb(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLoginInDb',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistsByLoginValidator,
    });
  };
}
