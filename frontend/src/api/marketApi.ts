import { ENV } from "../common/env";
import type { MarketStock } from "../types/stock";

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
