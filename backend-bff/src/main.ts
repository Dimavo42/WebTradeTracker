import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './common/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [ENV.FRONT_URL_1, ENV.FRONT_URL_2],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(ENV.PORT);
}

void bootstrap().catch((err) => {
  console.error('Failed to start app', err);
});
