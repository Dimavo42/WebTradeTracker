import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [HttpModule],
  controllers: [StocksController],
  providers: [StocksService, JwtStrategy],
})
export class StocksModule {}
