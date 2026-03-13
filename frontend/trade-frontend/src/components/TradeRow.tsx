import type { Trade } from "../types/trade";

type TradeRowProps = {
  trade: Trade;
  onDelete: (symbol: string) => Promise<void>;
};

export default function TradeRow({ trade, onDelete }: TradeRowProps) {
  return (
    <tr>
      <td>{trade.id}</td>
      <td>{trade.stockId}</td>
      <td>{trade.symbol}</td>
      <td>{trade.quantity}</td>
      <td>{trade.entryPrice}</td>
      <td>{trade.status}</td>
      <td>{trade.tradeType}</td>
      <td>{new Date(trade.entryDate).toLocaleString()}</td>
      <td>{trade.fees ?? "-"}</td>
      <td>
        <button onClick={() => onDelete(trade.symbol)}>Delete</button>
      </td>
    </tr>
  );
}