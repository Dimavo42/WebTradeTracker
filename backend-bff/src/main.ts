import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './common/env';
import {
  CorsOptionsCallback,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request } from 'express';

const corsOptions: CorsOptionsDelegate<Request> = (
  req: Request,
  callback: CorsOptionsCallback,
) => {
  const rawOrigin = req.headers.origin;
  let origin: string | undefined;

  if (typeof rawOrigin === 'string') {
    origin = rawOrigin;
  } else if (Array.isArray(rawOrigin)) {
    origin = rawOrigin[0];
  }

  const allowed = [ENV.FRONT_URL_1, ENV.FRONT_URL_2];

  if (!origin) {
    return callback(null, {
      origin: true,
      credentials: true,
    });
  }

  if (ENV.MOBILE_ORIGIN === '*' || allowed.includes(origin)) {
    return callback(null, {
      origin: true,
      credentials: true,
    });
  }

  return callback(new Error('Not allowed by CORS'), {
    origin: false,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);

  app.setGlobalPrefix('api');
  await app.listen(ENV.PORT);
}

void bootstrap();
