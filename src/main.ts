import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //убираем cors
  await runDb();
  await app.listen(5000);
}
bootstrap();
