import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../exception.filter';

export const createApp = (app: INestApplication) => {
  app.use(cookieParser());
  app.enableCors(); //убираем cors
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //делай трансофрацию по типам
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          Object.keys(e.constraints).map((key) => {
            errorsForResponse.push({
              field: e.property,
              message: e.constraints[key],
            });
          });
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  ); //регестрируем глобальный pipe
  app.useGlobalFilters(new HttpExceptionFilter()); //подключаем фильтер
  //  useContainer(app.get(AppModule), { fallbackOnErrors: false }); //для кастомных валидаций
  return app;
};
