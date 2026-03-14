import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { createTrade, deleteTradesBySymbol, getTrades, updateTradeFromModel } from "./api/tradesApi";
import type { CreateTradeRequest, Trade } from "./types/trade";
import TradeForm from "./components/TradeForm";
import TradeTable from "./components/TradeTable";
import TradeStats from "./components/TradeStats";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null);
  const [editedTrade, setEditedTrade] = useState<Trade | null>(null);

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

  const handleStartEdit = (trade: Trade) => {
    setEditingTradeId(trade.id);
    setEditedTrade({ ...trade });
  };

  const handleCancelEdit = () => {
    setEditingTradeId(null);
    setEditedTrade(null);
  };

  const handleChangeEdit = (field: keyof Trade, value: string | number) => {
    setEditedTrade((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSaveEdit = async () => {
    if (!editedTrade) return;

    try {
      setError("");

      await updateTradeFromModel(editedTrade);

      setTrades((prev) =>
        prev.map((trade) =>
          trade.id === editedTrade.id ? editedTrade : trade
        )
      );

      setEditingTradeId(null);
      setEditedTrade(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

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

      <TradeForm onSubmit={handleCreateTrade} editingTrade={editedTrade} />

      <ErrorMessage message={error} />

      {loading && <p>Loading...</p>}

      <TradeStats trades={trades} />

      <TradeTable
        trades={trades}
        editingTradeId={editingTradeId}
        editedTrade={editedTrade}
        onDelete={handleDeleteTrade}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onChangeEdit={handleChangeEdit}
        onSaveEdit={handleSaveEdit}
      />
    </div>
  );
}

export default App;