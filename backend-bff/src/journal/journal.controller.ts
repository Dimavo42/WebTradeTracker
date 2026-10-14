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
}
