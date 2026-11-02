import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../common/guards/jwtAuth.guard';
import { Token } from '../common/decorators/token.decorator';
import { Trade } from './types/trade.types';
import type { CreateTradeDto } from './dto/createTrade.dto';
import type { UpdateTradeDto } from './dto/updateTrade.dto';
import type { SaveUserStockDto } from './dto/saveUserStock.dto';
import { UserStock } from './types/userStock.types';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get('trades')
  getTrades(@Token() token: string): Promise<Trade[]> {
    return this.journalService.getTrades(token);
  }

  @Post('trades')
  createTrade(
    @Body() dto: CreateTradeDto,
    @Token() token: string,
  ): Promise<void> {
    return this.journalService.createTrade(dto, token);
  }

  @Put('trades/:id')
  updateTrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTradeDto,
    @Token() token: string,
  ): Promise<void> {
    return this.journalService.updateTrade(id, dto, token);
  }

  @Delete('trades/symbol/:symbol')
  deleteTradesBySymbol(
    @Param('symbol') symbol: string,
    @Token() token: string,
  ): Promise<void> {
    return this.journalService.deleteTradesBySymbol(symbol, token);
  }

  @Get('stocks')
  getStocks(@Token() token: string): Promise<UserStock[]> {
    return this.journalService.getStocks(token);
  }

  @Put('stocks/:symbol')
  saveStock(
    @Param('symbol') symbol: string,
    @Body() dto: SaveUserStockDto,
    @Token() token: string,
  ): Promise<UserStock> {
    return this.journalService.saveStock(symbol, dto, token);
  }

  @Delete('stocks/:symbol')
  removeStock(
    @Param('symbol') symbol: string,
    @Token() token: string,
  ): Promise<void> {
    return this.journalService.removeStock(symbol, token);
  }
}
