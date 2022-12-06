import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './db';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await runDb();
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
  await app.listen(5000);
}
bootstrap();
