import { useAppSelector } from "../hooks/reduxHooks";
import { useStocks } from "../hooks/useStocks";
import ErrorMessage from "../components/common/ErrorMessage";
import styles from "./StockPage.module.css";

export default function StockPage() {
  const token = useAppSelector((state) => state.auth.token);
  const { stocks, loading, error } = useStocks(token);

  if (loading) {
    return <p>Loading stocks...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📈 Stocks</h2>

      {error && <ErrorMessage message={error} />}

      {!error && stocks.length === 0 ? (
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