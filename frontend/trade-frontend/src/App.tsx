import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { createTrade, deleteTradesBySymbol, getTrades } from "./api/tradesApi";
import type { CreateTradeRequest, Trade } from "./types/trade";

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateTradeRequest>({
    stockSymbol: "",
    quantity: 0,
    tradeType: "Open",
    price: 0,
    tradeDate: new Date().toISOString().slice(0, 16),
  });

  const loadTrades = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setError("");
      await createTrade(form);

      setForm({
        stockSymbol: "",
        quantity: 0,
        tradeType: "Open",
        price: 0,
        tradeDate: new Date().toISOString().slice(0, 16),
      });

      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleDelete(symbol: string) {
    try {
      setError("");
      await deleteTradesBySymbol(symbol);
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
          name="stockSymbol"
          placeholder="Stock Symbol"
          value={form.stockSymbol}
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
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <select
          name="tradeType"
          value={form.tradeType}
          onChange={handleChange}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          name="tradeDate"
          type="datetime-local"
          value={form.tradeDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Trade</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

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
                <tr key={trade.id}>
                  <td>{trade.id}</td>
                  <td>{trade.stockId}</td>
                  <td>{trade.symbol}</td>
                  <td>{trade.quantity}</td> 
                  <td>{trade.entryPrice}</td>
                  <td>{trade.status}</td>
                  <td>{trade.tradeType}</td>
                  <td>{new Date(trade.entryDate).toLocaleString()}</td>
                  <td>{trade.fees}</td>
                  <td>
                    <button onClick={() => handleDelete(trade.symbol)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;