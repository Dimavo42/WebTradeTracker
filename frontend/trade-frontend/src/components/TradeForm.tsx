import { useState } from "react";
import type { CreateTradeRequest } from "../types/trade";

type TradeFormProps = {
  onSubmit: (form: CreateTradeRequest) => Promise<void>;
};

function getInitialForm(): CreateTradeRequest {
  return {
    stockSymbol: "",
    quantity: 0,
    tradeType: "Open",
    price: 0,
    fees: 0,
    tradeDate: new Date().toISOString().slice(0, 16),
  };
}

export default function TradeForm({ onSubmit }: TradeFormProps) {
  const [form, setForm] = useState<CreateTradeRequest>(getInitialForm());

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price" || name === "fees"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(form);
    setForm(getInitialForm());
  }

  return (
    <form className="trade-form" onSubmit={handleSubmit}>
      
      <div className="form-group">
        <label htmlFor="stockSymbol">Stock Symbol</label>
        <input
          id="stockSymbol"
          name="stockSymbol"
          placeholder="AAPL"
          value={form.stockSymbol}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          placeholder="10"
          value={form.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="185.50"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="fees">Fees</label>
        <input
          id="fees"
          name="fees"
          type="number"
          step="0.01"
          placeholder="2.50"
          value={form.fees}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tradeType">Trade Status</label>
        <select
          id="tradeType"
          name="tradeType"
          value={form.tradeType}
          onChange={handleChange}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tradeDate">Trade Date</label>
        <input
          id="tradeDate"
          name="tradeDate"
          type="datetime-local"
          value={form.tradeDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Add Trade</button>
    </form>
  );
}