import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JournalModule } from './journal/journal.module';
import { MarketModule } from './market/market.module';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { RequestLoggerMiddleware } from './common/middleware/requestLogger.middleware';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [AuthModule, JournalModule, MarketModule, ChatbotModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
