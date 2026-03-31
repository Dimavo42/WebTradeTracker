import { useCallback, useEffect, useState } from "react";
import { getStocks } from "../api/stocksApi";
import type { Stock } from "../types/stock";

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Failed to load stocks";
}

export function useStocks(token: string | null) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStocks = useCallback(async () => {
    if (!token) {
      setStocks([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getStocks(token);
      setStocks(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadStocks();
  }, [loadStocks]);

  return {
    stocks,
    loading,
    error,
    loadStocks,
  };
}