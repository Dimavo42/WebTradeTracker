import { ENV } from "../common/env";
import type { MarketStock, PricePoint } from "../types/stock";

const BASE_URL = `${ENV.BASE_URL}/market`;

export async function getMarketStocks(): Promise<MarketStock[]> {
  const response = await fetch(`${BASE_URL}/stocks`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch market stocks: ${response.status}`);
  }

  return response.json();
}

export async function getStockHistory(symbol: string): Promise<PricePoint[]> {
  const response = await fetch(
    `${BASE_URL}/history/${encodeURIComponent(symbol)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch price history: ${response.status}`);
  }

  return response.json();
}
