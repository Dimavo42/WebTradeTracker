import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { JwtAuthGuard } from '../common/guards/jwtAuth.guard';
import { DeleteStockResponseDto } from './dto/deleteStockResponse.dto';
import { StockDto } from './dto/stock.dto';
import type { CreateStockDto } from './dto/createStock.dto';
import { Token } from 'src/common/decorators/token.decorator';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Token() token: string): Promise<StockDto[]> {
    return this.stocksService.getStocks(token);
  }

  @Get(':id')
  async getStockById(
    @Param('id') id: string,
    @Token() token: string,
  ): Promise<StockDto> {
    return this.stocksService.getStockById(Number(id), token);
  }

  @Post()
  async createStock(
    @Body() dto: CreateStockDto,
    @Token() token: string,
  ): Promise<StockDto> {
    return this.stocksService.createStock(dto, token);
  }

  @Delete(':id')
  async deleteStock(
    @Param('id') id: string,
    @Token() token: string,
  ): Promise<DeleteStockResponseDto> {
    return this.stocksService.deleteStock(Number(id), token);
  }
}
