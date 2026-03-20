import { useCallback, useEffect, useState } from "react";
import { getStocks } from "../api/stocksApi";
import type { Stock } from "../types/stock";
import { useAppSelector } from "../hooks/reduxHooks";

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.auth.token);

  const fetchStocks = useCallback(async () => {
    if (!token) {
      setStocks([]);
      return;
    }
    try {
      setLoading(true);
      if (token) {
        const response = await getStocks(token);
        setStocks(response);
      }
    } catch (err) {
      console.error("Failed to load stocks", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  if (loading) return <p>Loading stocks...</p>;

  return (
    <div>
      <h2>📈 Stocks</h2>

      {stocks.length === 0 ? (
        <p>No stocks found</p>
      ) : (
        <ul>
          {stocks.map((stock) => (
            <li key={stock.symbol}>
              {stock.symbol} - ${stock.companyName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
