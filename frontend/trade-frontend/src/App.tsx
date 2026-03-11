import { useEffect, useState } from "react";
import "./App.css";
import { createTrade, deleteTrade, getTrades } from "./api/tradesApi";
import type { CreateTradeRequest, Trade } from "./types/trade";

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CreateTradeRequest>({
    symbol: "",
    quantity: 0,
    entryPrice: 0,
    status: "Open",
    entryDate: new Date().toISOString().slice(0, 16),
  });

  async function loadTrades() {
    try {
      setLoading(true);
      setError("");
      const data = await getTrades();
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrades();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "entryPrice"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setError("");
      await createTrade(form);

      setForm({
        symbol: "",
        quantity: 0,
        entryPrice: 0,
        status: "Open",
        entryDate: new Date().toISOString().slice(0, 16),
      });

      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleDelete(id: number) {
    try {
      setError("");
      await deleteTrade(id);
      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="container">
      <h1>Trade Journal</h1>

      <form className="trade-form" onSubmit={handleSubmit}>
        <input
          name="symbol"
          placeholder="Symbol"
          value={form.symbol}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          name="entryPrice"
          type="number"
          step="0.01"
          placeholder="Entry Price"
          value={form.entryPrice}
          onChange={handleChange}
          required
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          name="entryDate"
          type="datetime-local"
          value={form.entryDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Trade</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Entry Price</th>
            <th>Status</th>
            <th>Entry Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td colSpan={7}>No trades found.</td>
            </tr>
          ) : (
            trades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.id}</td>
                <td>{trade.symbol}</td>
                <td>{trade.quantity}</td>
                <td>{trade.entryPrice}</td>
                <td>{trade.status}</td>
                <td>{new Date(trade.entryDate).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(trade.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
