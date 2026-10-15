import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  ASSET_TYPES,
  COUNTRIES,
  SECTORS,
} from '../../common/scripts/yahooFinance';
import type { AssetType, CountryCode } from '../../common/scripts/yahooFinance';

export const RESULT_LIMITS = [10, 25, 50, 100];

// Query parameters for GET /api/market/stocks/search
export class MarketStockFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'search must be at most 50 characters' })
  search?: string;

  @IsIn(COUNTRIES.map((c) => c.code), {
    message: `country must be one of: ${COUNTRIES.map((c) => c.code).join(', ')}`,
  })
  country: CountryCode = 'US';

  @IsIn(ASSET_TYPES, {
    message: `type must be one of: ${ASSET_TYPES.join(', ')}`,
  })
  type: AssetType = 'stock';

  @IsOptional()
  @IsIn(SECTORS, { message: 'sector is not a valid sector' })
  sector?: string;

  @Type(() => Number)
  @IsIn(RESULT_LIMITS, {
    message: `limit must be one of: ${RESULT_LIMITS.join(', ')}`,
  })
  limit: number = 50;
}
