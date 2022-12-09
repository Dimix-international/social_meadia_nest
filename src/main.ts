import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { runDb } from './db';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
import { settings } from './settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await runDb();
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
  await app.listen(settings.PORT, () => {
    console.log(`App started at ${settings.PORT}`);
  });
}
bootstrap();
