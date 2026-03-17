import { Module } from '@nestjs/common';

import { TradesModule } from './trades/trades.module';
import { TradesService } from './trades/trades.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TradesModule],
  providers: [TradesService],
})
export class AppModule {}
