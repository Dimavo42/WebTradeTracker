import { useState } from "react";
import { getStockHistory } from "../../api/marketApi";
import type { PricePoint } from "../../types/stock";
import PriceChart from "./PriceChart";
import styles from "../../pages/StockPage.module.css";

type StockCardProps = {
  symbol: string;
  name: string | null;
  price: number | null;
  currency: string | null;
  changePercent: number | null;
  tradeCount: number;
  isSelected: boolean;
};

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Failed to load chart";
}

export default function StockCard({
  symbol,
  name,
  price,
  currency,
  changePercent,
  tradeCount,
  isSelected,
}: StockCardProps) {
  const [showChart, setShowChart] = useState(false);
  const [history, setHistory] = useState<PricePoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    const next = !showChart;
    setShowChart(next);

    if (next && !history && !loading) {
      setLoading(true);
      setError(null);

      getStockHistory(symbol)
        .then(setHistory)
        .catch((err: unknown) => setError(getErrorMessage(err)))
        .finally(() => setLoading(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-pressed={showChart}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.symbol}>{symbol}</h3>
        <div className={styles.badges}>
          {tradeCount > 0 && (
            <span className={styles.badgeJournal}>
              {tradeCount} trade{tradeCount === 1 ? "" : "s"}
            </span>
          )}
          {isSelected && <span className={styles.badgeSelected}>Selected</span>}
        </div>
      </div>

      {showChart ? (
        <div className={styles.cardBody}>
          {loading && <p className={styles.message}>Loading 5-year chart...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {history && <PriceChart symbol={symbol} points={history} />}
          <p className={styles.hint}>Click to go back</p>
        </div>
      ) : (
        <div className={styles.cardBody}>
          <p className={styles.name}>{name ?? "Unknown company"}</p>

          <p className={styles.price}>
            {price === null ? "Price N/A" : `${price.toFixed(2)} ${currency ?? ""}`}
            {changePercent !== null && (
              <span className={changePercent >= 0 ? styles.up : styles.down}>
                {" "}
                {changePercent >= 0 ? "+" : ""}
                {changePercent.toFixed(2)}%
              </span>
            )}
          </p>

          <p className={styles.hint}>Click to view 5-year chart</p>
        </div>
      )}
    </div>
  );
}
