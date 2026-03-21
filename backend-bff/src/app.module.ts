import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TradesModule } from './trades/trades.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { RequestLoggerMiddleware } from './common/middleware/requestLogger.middleware';

@Module({
  imports: [TradesModule, AuthModule, StocksModule],
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
