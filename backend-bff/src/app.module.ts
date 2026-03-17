import { Module } from '@nestjs/common';
import { TradesModule } from './trades/trades.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TradesModule, AuthModule],
})
export class AppModule {}
