import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  imports: [HttpModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
