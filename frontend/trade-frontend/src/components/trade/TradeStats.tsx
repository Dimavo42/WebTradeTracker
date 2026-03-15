import type { Trade } from "../../types/trade";
import styles from "./TradeStats.module.css";

type TradeStatsProps = {
  trades: Trade[];
};

export default function TradeStats({ trades }: TradeStatsProps) {
  const totalTrades = trades.length;

  const openTrades = trades.filter((trade) => trade.status === "Open").length;
  const closedTrades = trades.filter((trade) => trade.status === "Closed").length;

  const totalVolume = trades.reduce((sum, trade) => sum + trade.quantity, 0);

  const totalFees = trades.reduce((sum, trade) => sum + (trade.fees ?? 0), 0);

  const totalProfit = trades.reduce((sum, trade) => {
    if (trade.exitPrice == null) return sum;

    let profit = 0;

    if (trade.tradeType === "Buy") {
      profit = (trade.exitPrice - trade.entryPrice) * trade.quantity;
    } else if (trade.tradeType === "Sell") {
      profit = (trade.entryPrice - trade.exitPrice) * trade.quantity;
    }

    profit -= trade.fees ?? 0;

    return sum + profit;
  }, 0);

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h3 className={styles.statTitle}>Total Trades</h3>
        <p className={styles.statValue}>{totalTrades}</p>
      </div>

      <div className={styles.statCard}>
        <h3 className={styles.statTitle}>Open Trades</h3>
        <p className={styles.statValue}>{openTrades}</p>
      </div>

      <div className={styles.statCard}>
        <h3 className={styles.statTitle}>Closed Trades</h3>
        <p className={styles.statValue}>{closedTrades}</p>
      </div>

      <div className={styles.statCard}>
        <h3 className={styles.statTitle}>Total Volume</h3>
        <p className={styles.statValue}>{totalVolume}</p>
      </div>

      <div className={styles.statCard}>
        <h3 className={styles.statTitle}>Total Fees</h3>
        <p className={styles.statValue}>₪{totalFees.toFixed(2)}</p>
      </div>

      <div className={styles.statCard}>
        <h3 className={styles.statTitle}>Total Profit</h3>
        <p
          className={`${styles.statValue} ${
            totalProfit >= 0 ? styles.positive : styles.negative
          }`}
        >
          ₪{totalProfit.toFixed(2)}
        </p>
      </div>
    </div>
  );
}