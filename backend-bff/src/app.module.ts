import { Module } from '@nestjs/common';
import { TradesModule } from './trades/trades.module';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [TradesModule, AuthModule, StocksModule],
})
export class AppModule {}
