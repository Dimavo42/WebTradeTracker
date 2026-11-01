import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './common/env';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: ENV.KAFKA_GROUP_ID,
        brokers: [ENV.KAFKA_BROKERS],
        retry: { retries: 10 },
      },
      consumer: {
        groupId: ENV.KAFKA_GROUP_ID,
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });
  app.enableShutdownHooks();
  await app.init();
  await app.startAllMicroservices();
  await app.listen(ENV.PORT);
}
void bootstrap();
