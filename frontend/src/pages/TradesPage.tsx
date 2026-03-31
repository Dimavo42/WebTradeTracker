import { useState } from "react";
import type { Trade, CreateTradeRequest } from "../types/trade";
import TradeForm from "../components/trade/TradeForm";
import TradeTable from "../components/trade/TradeTable";
import TradeStats from "../components/trade/TradeStats";
import ErrorMessage from "../components/common/ErrorMessage";
import styles from "./TradesPage.module.css";
import { useTrades } from "../hooks/useTrades";

export default function TradesPage() {
  const { trades, loading, error, addTrade, deleteTrade, updateTrade } = useTrades();

  const [editingTradeId, setEditingTradeId] = useState<number | null>(null);
  const [editedTrade, setEditedTrade] = useState<Trade | null>(null);

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
      await updateTrade(editedTrade);
      setEditingTradeId(null);
      setEditedTrade(null);
    } catch {
      // error already handled in hook
    }
  };

  const handleCreateTrade = async (form: CreateTradeRequest) => {
    try {
      await addTrade(form);
    } catch {
      // error already handled in hook
    }
  };

  const handleDeleteTrade = async (symbol: string) => {
    try {
      await deleteTrade(symbol);
    } catch {
      // error already handled in hook
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trade Journal</h1>

      <TradeForm onSubmit={handleCreateTrade} />

      {error && <ErrorMessage message={error} />}

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