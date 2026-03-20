import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { JwtAuthGuard } from './jwtAuth.guard';
import type { Request } from 'express';
import { DeleteStockResponseDto } from './dto/deleteStockResponse.dto';
import { StockDto } from './dto/stock.dto';
import { CreateStockDto } from './dto/createStock.dto';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Req() req: Request): Promise<StockDto[]> {
    return this.stocksService.getStocks(this.extractToken(req));
  }

  @Get(':id')
  async getStockById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<StockDto> {
    return this.stocksService.getStockById(Number(id), this.extractToken(req));
  }

  @Post()
  async createStock(
    @Body() dto: CreateStockDto,
    @Req() req: Request,
  ): Promise<StockDto> {
    return this.stocksService.createStock(dto, this.extractToken(req));
  }

  @Delete(':id')
  async deleteStock(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteStockResponseDto> {
    return this.stocksService.deleteStock(Number(id), this.extractToken(req));
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }

    return authHeader.substring(7);
  }
}
