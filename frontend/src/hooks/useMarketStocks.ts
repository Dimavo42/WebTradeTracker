import { useCallback, useEffect, useState } from "react";
import { getMarketFilterOptions, searchMarketStocks } from "../api/marketApi";
import type {
  MarketFilterOptions,
  MarketStock,
  MarketStockFilters,
} from "../types/stock";

export const DEFAULT_FILTERS: MarketStockFilters = {
  country: "US",
  type: "stock",
  limit: 50,
};

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Failed to load market stocks";
}

export function useMarketStocks() {
  const [stocks, setStocks] = useState<MarketStock[]>([]);
  const [appliedFilters, setAppliedFilters] =
    useState<MarketStockFilters>(DEFAULT_FILTERS);
  const [options, setOptions] = useState<MarketFilterOptions>({
    countries: [],
    types: [],
    sectors: [],
    limits: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filters: MarketStockFilters) => {
    try {
      setLoading(true);
      setError(null);
      setStocks(await searchMarketStocks(filters));
      setAppliedFilters(filters);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(DEFAULT_FILTERS);

    getMarketFilterOptions()
      .then(setOptions)
      .catch((err: unknown) => setError(getErrorMessage(err)));
  }, [load]);

  const applyFilters = useCallback(
    (filters: MarketStockFilters) => load(filters),
    [load]
  );

  const resetFilters = useCallback(() => load(DEFAULT_FILTERS), [load]);

  return {
    stocks,
    appliedFilters,
    options,
    loading,
    error,
    applyFilters,
    resetFilters,
  };
}
