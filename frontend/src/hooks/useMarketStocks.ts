import { useEffect, useState } from "react";
import { getMarketStocks } from "../api/marketApi";
import type { MarketStock } from "../types/stock";

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Failed to load market stocks";
}

export function useMarketStocks() {
  const [stocks, setStocks] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarketStocks()
      .then(setStocks)
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return {
    stocks,
    loading,
    error,
  };
}
