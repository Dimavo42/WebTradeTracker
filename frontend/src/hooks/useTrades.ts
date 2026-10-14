import { useCallback, useEffect, useState } from "react";
import {
  createTrade,
  deleteTradesBySymbol,
  getTrades,
  updateTrade as updateTradeRequest,
} from "../api/journalApi";
import type { CreateTradeRequest, Trade } from "../types/trade";

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

export function useTrades(token: string | null) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrades = useCallback(async () => {
    if (!token) {
      setTrades([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTrades(token);
      setTrades(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadTrades();
  }, [loadTrades]);

  const addTrade = async (form: CreateTradeRequest) => {
    if (!token) return;

    try {
      setError(null);
      await createTrade(form, token);
      await loadTrades();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const deleteTrade = async (symbol: string) => {
    if (!token) return;

    try {
      setError(null);
      await deleteTradesBySymbol(symbol, token);
      await loadTrades();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const updateTrade = async (trade: Trade) => {
    if (!token) return;

    try {
      setError(null);
      await updateTradeRequest(trade, token);
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
