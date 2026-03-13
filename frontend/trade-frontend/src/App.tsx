import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { createTrade, deleteTradesBySymbol, getTrades } from "./api/tradesApi";
import type { CreateTradeRequest, Trade } from "./types/trade";
import TradeForm from "./components/TradeForm";
import TradeTable from "./components/TradeTable";
import TradeStats from "./components/TradeStats";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

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


  function handleEditTrade(trade: Trade) {
  setEditingTrade(trade);
}

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

      <TradeForm onSubmit={handleCreateTrade} editingTrade={editingTrade} />

      <ErrorMessage message={error} />

      {loading && <p>Loading...</p>}

      <TradeStats trades={trades} />

      <TradeTable trades={trades} onDelete={handleDeleteTrade} onEdit={handleEditTrade} />
    </div>
  );
}

export default App;