import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './db';
import { settings } from './settings';
import { createApp } from './helpers/create-app';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  await runDb();
  const app = createApp(rawApp);
  await app.listen(settings.PORT, () => {
    console.log(`App started at ${settings.PORT}`);
  });
}
bootstrap();
