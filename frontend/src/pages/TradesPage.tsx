import { useState } from "react";
import type { Trade, CreateTradeRequest } from "../types/trade";
import SelectedStocksTable from "../components/trade/SelectedStocksTable";
import TradeTable from "../components/trade/TradeTable";
import TradeStats from "../components/trade/TradeStats";
import ErrorMessage from "../components/common/ErrorMessage";
import styles from "./TradesPage.module.css";
import { useTrades } from "../hooks/useTrades";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  removeTradeStock,
  updateTradeStock,
  type userTradeStocks,
} from "../features/userStocks";

export default function TradesPage() {
  const token = useAppSelector((state) => state.auth.token);
  const userStocks = useAppSelector((state) => state.userTradeStocks);
  const dispatch = useAppDispatch();

  const { trades, loading, error, addTrade, deleteTrade, updateTrade } =
    useTrades(token);

  const [editingTradeId, setEditingTradeId] = useState<number | null>(null);
  const [editedTrade, setEditedTrade] = useState<Trade | null>(null);

  const handleAddTradeFromStock = async (
    stock: userTradeStocks,
    tradeType: CreateTradeRequest["tradeType"]
  ) => {
    try {
      await addTrade({
        stockSymbol: stock.symbol,
        quantity: stock.quantity,
        tradeType,
        status: "Open",
        price: stock.entryPrice,
        fees: 0,
        tradeDate: new Date().toISOString(),
      });

      dispatch(removeTradeStock(stock));
    } catch {
      // error already handled in hook
    }
  };

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

      {error && <ErrorMessage message={error} />}

      <h2 className={styles.sectionTitle}>Selected Stocks</h2>

      <SelectedStocksTable
        stocks={userStocks}
        onUpdate={(stock) => dispatch(updateTradeStock(stock))}
        onRemove={(stock) => dispatch(removeTradeStock(stock))}
        onAddTrade={handleAddTradeFromStock}
      />

      <h2 className={styles.sectionTitle}>My Trades</h2>

      {loading && <p>Loading...</p>}

      <TradeStats trades={trades} />

      {!loading && trades.length === 0 ? (
        <p className={styles.emptyMessage}>
          No trades yet. Add a trade from the Selected Stocks table.
        </p>
      ) : (
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
      )}
    </div>
  );
}
