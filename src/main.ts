import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { settings } from './settings';
import { createApp } from './helpers/create-app';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);
  await app.listen(settings.PORT, () => {
    console.log(`App started at ${settings.PORT}`);
  });
}
bootstrap();
