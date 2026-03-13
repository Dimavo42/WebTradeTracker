import type { Trade } from "../types/trade";
import TradeRow from "./TradeRow";

type TradeTableProps = {
  trades: Trade[];
  onDelete: (symbol: string) => Promise<void>;
  onEdit: (trade: Trade) => void;
};

export default function TradeTable({ trades, onDelete,onEdit }: TradeTableProps) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Entry / Exit Price</th>
            <th>Status</th>
            <th>Trade Type</th>
            <th>Trade Date</th>
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
              <TradeRow key={trade.id} trade={trade} onDelete={onDelete} onEdit={onEdit} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}