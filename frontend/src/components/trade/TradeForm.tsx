import { useState } from "react";
import type { CreateTradeRequest } from "../../types/trade";
import Button from "../common/Button";
import styles from "./TradeForm.module.css";

type TradeFormProps = {
  onSubmit: (form: CreateTradeRequest) => Promise<void>;
};



const initialForm: CreateTradeRequest = {
  stockSymbol: "",
    quantity: 0,
    tradeType: "Buy",
    status: "Open",
    price: 0,
    fees: 0,
    tradeDate: new Date().toISOString().slice(0, 16),
};

export default function TradeForm({ onSubmit }: TradeFormProps) {
  const [form, setForm] = useState<CreateTradeRequest>(initialForm);

  const handleChange = (
    field: keyof CreateTradeRequest,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);

    setForm({
      ...initialForm,
      tradeDate: new Date().toISOString().slice(0, 16),
    });
  };

  return (
    <form className={styles.tradeForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="stockSymbol" className={styles.label}>
          Stock Symbol
        </label>
        <input
          id="stockSymbol"
          className={styles.input}
          value={form.stockSymbol}
          onChange={(e) => handleChange("stockSymbol", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="quantity" className={styles.label}>
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          className={styles.input}
          value={form.quantity}
          onChange={(e) => handleChange("quantity", Number(e.target.value))}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tradeType" className={styles.label}>
          Trade Type
        </label>
        <select
          id="tradeType"
          className={styles.select}
          value={form.tradeType}
          onChange={(e) => handleChange("tradeType", e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="Close">Close</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price" className={styles.label}>
          Price
        </label>
        <input
          id="price"
          type="number"
          className={styles.input}
          value={form.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tradeDate" className={styles.label}>
          Trade Date
        </label>
        <input
          id="tradeDate"
          type="datetime-local"
          className={styles.input}
          value={form.tradeDate}
          onChange={(e) => handleChange("tradeDate", e.target.value)}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <Button type="submit" variant="primary" size="medium">
          Add Trade
        </Button>
      </div>
    </form>
  );
}