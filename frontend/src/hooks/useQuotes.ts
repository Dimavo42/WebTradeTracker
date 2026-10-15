import { useEffect, useState } from "react";
import { getQuotes } from "../api/marketApi";
import type { MarketStock } from "../types/stock";

// Live quotes for a list of symbols, e.g. the stocks in the user's journal.
export function useQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<MarketStock[]>([]);
  const key = symbols.join(",");

  useEffect(() => {
    if (!key) return;

    getQuotes(key.split(","))
      .then(setQuotes)
      .catch(() => {
        // cards show "Price N/A" without quotes
      });
  }, [key]);

  return key ? quotes : [];
}
