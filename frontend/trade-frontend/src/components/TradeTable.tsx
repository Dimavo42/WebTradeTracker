import type { Trade } from "../types/trade";
import TradeRow from "./TradeRow";

type TradeTableProps = {
  trades: Trade[];
  onDelete: (symbol: string) => Promise<void>;
};

export default function TradeTable({ trades, onDelete }: TradeTableProps) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Stock Id</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Trade Type</th>
            <th>Date</th>
            <th>Fees</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td colSpan={10}>No trades found.</td>
            </tr>
          ) : (
            trades.map((trade) => (
              <TradeRow key={trade.id} trade={trade} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}