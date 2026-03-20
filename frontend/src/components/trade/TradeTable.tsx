import type { Trade } from "../../types/trade";
import Button from "../common/Button";
import styles from "./TradeTable.module.css";

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
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>Entry Price</th>
            <th>Entry Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade) => {
            const isEditing = editingTradeId === trade.id;

            return (
              <tr key={trade.id}>
                <td>{trade.id}</td>

                <td>
                  {isEditing && editedTrade ? (
                    <input
                      className={styles.editingInput}
                      value={editedTrade.symbol}
                      onChange={(e) => onChangeEdit("symbol", e.target.value)}
                    />
                  ) : (
                    trade.symbol
                  )}
                </td>

                <td>
                  {isEditing && editedTrade ? (
                    <input
                      type="number"
                      className={styles.editingInput}
                      value={editedTrade.quantity}
                      onChange={(e) =>
                        onChangeEdit("quantity", Number(e.target.value))
                      }
                    />
                  ) : (
                    trade.quantity
                  )}
                </td>

                <td>
                  {isEditing && editedTrade ? (
                    <select
                      className={styles.editingSelect}
                      value={editedTrade.tradeType}
                      onChange={(e) =>
                        onChangeEdit("tradeType", e.target.value)
                      }
                    >
                      <option value="Buy">Buy</option>
                      <option value="Sell">Sell</option>
                    </select>
                  ) : (
                    trade.tradeType
                  )}
                </td>

                <td>
                  {isEditing && editedTrade ? (
                    <input
                      type="number"
                      className={styles.editingInput}
                      value={editedTrade.entryPrice}
                      onChange={(e) =>
                        onChangeEdit("entryPrice", Number(e.target.value))
                      }
                    />
                  ) : (
                    trade.entryPrice
                  )}
                </td>

                <td>
                  {isEditing && editedTrade ? (
                    <input
                      type="datetime-local"
                      className={styles.editingInput}
                      value={editedTrade.entryDate?.slice(0, 16) ?? ""}
                      onChange={(e) =>
                        onChangeEdit("entryDate", e.target.value)
                      }
                    />
                  ) : (
                    new Date(trade.entryDate).toLocaleString()
                  )}
                </td>

                <td>
                  <div className={styles.actions}>
                    {isEditing ? (
                      <>
                        <Button
                          variant="success"
                          size="small"
                          onClick={onSaveEdit}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={onCancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => onStartEdit(trade)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => onDelete(trade.symbol)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}