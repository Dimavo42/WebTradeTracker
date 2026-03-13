import type { Trade } from "../types/trade";

type TradeStatsProps = {
  trades: Trade[];
};

export default function TradeStats({ trades }: TradeStatsProps) {
  const totalTrades = trades.length;
  const openTrades = trades.filter((t) => t.status === "Open").length;
  const closedTrades = trades.filter((t) => t.status === "Closed").length;

  const totalFees = trades.reduce((sum, t) => sum + (t.fees ?? 0), 0);

  const totalProfit = trades.reduce((sum, t) => {
    if (t.exitPrice == null) return sum;

    let profit = 0;

    if (t.tradeType === "Buy") {
      profit = (t.exitPrice - t.entryPrice) * t.quantity;
    } else {
      profit = (t.entryPrice - t.exitPrice) * t.quantity;
    }

    profit -= t.fees ?? 0;
    return sum + profit;
  }, 0);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Trades</h3>
        <p>{totalTrades}</p>
      </div>

      <div className="stat-card">
        <h3>Open Trades</h3>
        <p>{openTrades}</p>
      </div>

      <div className="stat-card">
        <h3>Closed Trades</h3>
        <p>{closedTrades}</p>
      </div>

      <div className="stat-card">
        <h3>Total Fees</h3>
        <p>₪{totalFees.toFixed(2)}</p>
      </div>

      <div className="stat-card">
        <h3>Total Profit</h3>
        <p style={{ color: totalProfit >= 0 ? "green" : "red" }}>
          ₪{totalProfit.toFixed(2)}
        </p>
      </div>
    </div>
  );
}