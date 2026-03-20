import type { Trade } from "../../types/trade";

type TradeRowProps = {
  trade: Trade;
  isEditing: boolean;
  editedTrade: Trade | null;
  onDelete: (symbol: string) => Promise<void>;
  onStartEdit: (trade: Trade) => void;
  onCancelEdit: () => void;
  onChangeEdit: (field: keyof Trade, value: string | number) => void;
  onSaveEdit: () => Promise<void>;
};

export default function TradeRow({
  trade,
  isEditing,
  editedTrade,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onChangeEdit,
  onSaveEdit,
}: TradeRowProps) {
  const currentTrade = isEditing && editedTrade ? editedTrade : trade;

  const displayPrice =
    currentTrade.tradeType === "Buy"
      ? currentTrade.entryPrice
      : currentTrade.exitPrice;

  const displayDate =
    currentTrade.tradeType === "Buy"
      ? currentTrade.entryDate
      : currentTrade.exitDate;

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            value={currentTrade.symbol}
            onChange={(e) => onChangeEdit("symbol", e.target.value)}
          />
        ) : (
          trade.symbol
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            value={currentTrade.quantity}
            onChange={(e) => onChangeEdit("quantity", Number(e.target.value))}
          />
        ) : (
          trade.quantity
        )}
      </td>

      <td>
        {isEditing ? (
          currentTrade.tradeType === "Buy" ? (
            <input
              type="number"
              value={currentTrade.entryPrice ?? 0}
              onChange={(e) => onChangeEdit("entryPrice", Number(e.target.value))}
            />
          ) : (
            <input
              type="number"
              value={currentTrade.exitPrice ?? 0}
              onChange={(e) => onChangeEdit("exitPrice", Number(e.target.value))}
            />
          )
        ) : displayPrice != null ? (
          `₪${displayPrice.toFixed(2)}`
        ) : (
          "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <select
            value={currentTrade.status}
            onChange={(e) => onChangeEdit("status", e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        ) : (
          trade.status
        )}
      </td>

      <td>
        {isEditing ? (
          <select
            value={currentTrade.tradeType}
            onChange={(e) => onChangeEdit("tradeType", e.target.value)}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        ) : (
          trade.tradeType
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="datetime-local"
            value={
              displayDate
                ? new Date(displayDate).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              if (currentTrade.tradeType === "Buy") {
                onChangeEdit("entryDate", e.target.value);
              } else {
                onChangeEdit("exitDate", e.target.value);
              }
            }}
          />
        ) : displayDate ? (
          new Date(displayDate).toLocaleString()
        ) : (
          "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            value={currentTrade.fees ?? 0}
            onChange={(e) => onChangeEdit("fees", Number(e.target.value))}
          />
        ) : trade.fees != null ? (
          `₪${trade.fees.toFixed(2)}`
        ) : (
          "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <>
            <button
              className="save-btn"
              onClick={onSaveEdit}
            >
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-btn"
              onClick={() => onStartEdit(trade)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(trade.symbol)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}