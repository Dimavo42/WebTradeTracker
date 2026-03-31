import { useCallback, useEffect, useState } from "react";
import {
  createTrade,
  deleteTradesBySymbol,
  getTrades,
  updateTradeFromModel,
} from "../api/tradesApi";
import type { CreateTradeRequest, Trade } from "../types/trade";

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrades();
      setTrades(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrades();
  }, [loadTrades]);

  const addTrade = async (form: CreateTradeRequest) => {
    try {
      setError(null);
      await createTrade(form);
      await loadTrades();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const deleteTrade = async (symbol: string) => {
    try {
      setError(null);
      await deleteTradesBySymbol(symbol);
      await loadTrades();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const updateTrade = async (trade: Trade) => {
    try {
      setError(null);
      await updateTradeFromModel(trade);
      setTrades((prev) =>
        prev.map((current) => (current.id === trade.id ? trade : current))
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  return {
    trades,
    loading,
    error,
    loadTrades,
    addTrade,
    deleteTrade,
    updateTrade,
  };
}