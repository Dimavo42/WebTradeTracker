import { ENV } from "../common/env";
import type {
  MarketFilterOptions,
  MarketStock,
  MarketStockFilters,
  PricePoint,
} from "../types/stock";

const BASE_URL = `${ENV.BASE_URL}/market`;

// NestJS sends validation errors as { message: string | string[] }.
async function throwResponseError(
  response: Response,
  fallback: string
): Promise<never> {
  let message = `${fallback}: ${response.status}`;

  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) message = body.message.join(". ");
    else if (body.message) message = body.message;
  } catch {
    // not JSON, keep the fallback
  }

  throw new Error(message);
}

export async function searchMarketStocks(
  filters: MarketStockFilters
): Promise<MarketStock[]> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}/stocks/search?${params}`);

  if (!response.ok) {
    return throwResponseError(response, "Failed to fetch stocks");
  }

  return response.json();
}

export async function getMarketFilterOptions(): Promise<MarketFilterOptions> {
  const response = await fetch(`${BASE_URL}/filters`);

  if (!response.ok) {
    return throwResponseError(response, "Failed to fetch filter options");
  }

  return response.json();
}

export async function getQuotes(symbols: string[]): Promise<MarketStock[]> {
  if (symbols.length === 0) return [];

  const params = new URLSearchParams({ symbols: symbols.join(",") });
  const response = await fetch(`${BASE_URL}/quotes?${params}`);

  if (!response.ok) {
    return throwResponseError(response, "Failed to fetch quotes");
  }

  return response.json();
}

export async function getStockHistory(symbol: string): Promise<PricePoint[]> {
  const response = await fetch(
    `${BASE_URL}/history/${encodeURIComponent(symbol)}`
  );

  if (!response.ok) {
    return throwResponseError(response, "Failed to fetch price history");
  }

  return response.json();
}
