import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { createTrade, deleteTradesBySymbol, getTrades } from "./api/tradesApi";
import type { CreateTradeRequest, Trade } from "./types/trade";
import TradeForm from "./components/TradeForm";
import TradeTable from "./components/TradeTable";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTrades();
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  async function handleCreateTrade(form: CreateTradeRequest) {
    try {
      setError("");
      await createTrade(form);
      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleDeleteTrade(symbol: string) {
    try {
      setError("");
      await deleteTradesBySymbol(symbol);
      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="container">
      <h1>Trade Journal</h1>

      <TradeForm onSubmit={handleCreateTrade} />

      <ErrorMessage message={error} />

      {loading && <p>Loading...</p>}

      <TradeTable trades={trades} onDelete={handleDeleteTrade} />
    </div>
  );
}

export default App;