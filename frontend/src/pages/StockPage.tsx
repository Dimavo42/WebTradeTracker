import { useCallback, useEffect, useState } from "react";
import { getStocks } from "../api/stocksApi";
import type { Stock } from "../types/stock";
import { useAppSelector } from "../hooks/reduxHooks";
import styles from "./StockPage.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>📈 Stocks</h2>

      {stocks.length === 0 ? (
        <p className={styles.message}>No stocks found</p>
      ) : (
        <div className={styles.grid}>
          {stocks.map((stock) => (
            <div key={stock.id} className={styles.card}>
              <h3 className={styles.symbol}>{stock.symbol}</h3>

              <p>
                <strong>Company:</strong> {stock.companyName}
              </p>

              <p>
                <strong>Exchange:</strong> {stock.exchange ?? "N/A"}
              </p>

              <p>
                <strong>Sector:</strong> {stock.sector ?? "N/A"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(stock.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
