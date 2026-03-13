import type { Trade } from "../types/trade";

type TradeRowProps = {
  trade: Trade;
  onDelete: (symbol: string) => Promise<void>;
};

export default function TradeRow({ trade, onDelete }: TradeRowProps) {
  const displayPrice =
    trade.tradeType === "Buy"
      ? trade.entryPrice
      : trade.exitPrice;

  const displayDate =
    trade.tradeType === "Buy"
      ? trade.entryDate
      : trade.exitDate;

  return (
    <tr>
      <td>{trade.symbol}</td>
      <td>{trade.quantity}</td>
      <td>{displayPrice != null ? `₪${displayPrice.toFixed(2)}` : "-"}</td>
      <td>{trade.tradeType}</td>
      <td>{trade.status}</td>
      <td>{displayDate ? new Date(displayDate).toLocaleString() : "-"}</td>
      <td>{trade.fees != null ? `₪${trade.fees.toFixed(2)}` : "-"}</td>
      <td>
        <button
          className="delete-btn"
          onClick={() => onDelete(trade.symbol)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}