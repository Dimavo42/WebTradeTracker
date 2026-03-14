import type { Trade } from "../types/trade";
import TradeRow from "./TradeRow";

type TradeTableProps = {
  trades: Trade[];
  editingTradeId: number | null;
  editedTrade: Trade | null;
  onDelete: (symbol: string) => Promise<void>;
  onStartEdit: (trade: Trade) => void;
  onCancelEdit: () => void;
  onChangeEdit: (field: keyof Trade, value: string | number) => void;
  onSaveEdit: () => Promise<void>;
};

export default function TradeTable({
  trades,
  editingTradeId,
  editedTrade,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onChangeEdit,
  onSaveEdit,
}: TradeTableProps) {
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
              <td colSpan={8}>No trades found.</td>
            </tr>
          ) : (
            trades.map((trade) => (
              <TradeRow
                key={trade.id}
                trade={trade}
                isEditing={editingTradeId === trade.id}
                editedTrade={editedTrade}
                onDelete={onDelete}
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onChangeEdit={onChangeEdit}
                onSaveEdit={onSaveEdit}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}