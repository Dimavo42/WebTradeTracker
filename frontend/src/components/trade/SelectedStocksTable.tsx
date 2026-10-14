import { useState } from "react";
import type { userTradeStocks } from "../../features/userStocks";
import type { CreateTradeRequest } from "../../types/trade";
import Button from "../common/Button";
import styles from "./TradeTable.module.css";

type TradeType = CreateTradeRequest["tradeType"];

type SelectedStocksTableProps = {
  stocks: userTradeStocks[];
  onUpdate: (stock: userTradeStocks) => void;
  onRemove: (stock: userTradeStocks) => void;
  onAddTrade: (stock: userTradeStocks, tradeType: TradeType) => Promise<void>;
};

export default function SelectedStocksTable({
  stocks,
  onUpdate,
  onRemove,
  onAddTrade,
}: SelectedStocksTableProps) {
  const [tradeTypes, setTradeTypes] = useState<Record<string, TradeType>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleAddTrade = async (stock: userTradeStocks) => {
    try {
      setSavingId(stock.id);
      await onAddTrade(stock, tradeTypes[stock.id] ?? "Buy");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {stocks.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.emptyRow}>
                No stocks selected yet. Add stocks from the Home page.
              </td>
            </tr>
          )}

          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>

              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.editingInput}
                  value={stock.entryPrice}
                  onChange={(e) =>
                    onUpdate({ ...stock, entryPrice: Number(e.target.value) })
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  min="0"
                  className={styles.editingInput}
                  value={stock.quantity}
                  onChange={(e) =>
                    onUpdate({ ...stock, quantity: Number(e.target.value) })
                  }
                />
              </td>

              <td>
                <select
                  className={styles.editingSelect}
                  value={tradeTypes[stock.id] ?? "Buy"}
                  onChange={(e) =>
                    setTradeTypes((prev) => ({
                      ...prev,
                      [stock.id]: e.target.value as TradeType,
                    }))
                  }
                >
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
              </td>

              <td>
                <div className={styles.actions}>
                  <Button
                    variant="success"
                    size="small"
                    disabled={
                      stock.quantity <= 0 ||
                      stock.entryPrice <= 0 ||
                      savingId === stock.id
                    }
                    onClick={() => void handleAddTrade(stock)}
                  >
                    Add Trade
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => onRemove(stock)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
