import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './types/trade.types';
import type { CreateTradeDto } from './dto/createTrade.dto';
import type { UpdateTradeDto } from './dto/updateTrade.dto';

@Controller('trade')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  getTrades(): Promise<Trade[]> {
    return this.tradesService.getTrades();
  }

  @Post()
  createTrade(@Body() tradeDto: CreateTradeDto): Promise<Trade> {
    return this.tradesService.createTrade(tradeDto);
  }

  @Put(':id')
  updateTrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() tradeDto: UpdateTradeDto,
  ): Promise<Trade> {
    return this.tradesService.updateTrade(id, tradeDto);
  }

  @Delete('symbol/:symbol')
  deleteTradeBySymbol(@Param('symbol') symbol: string): Promise<void> {
    return this.tradesService.deleteTradeBySymbol(symbol);
  }
}
