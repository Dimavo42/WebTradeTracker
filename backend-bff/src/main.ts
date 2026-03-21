import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(3000);
}

void bootstrap().catch((err) => {
  console.error('Failed to start app', err);
});
