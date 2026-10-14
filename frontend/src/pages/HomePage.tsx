
import styles from "./TradesPage.module.css";
import tableStyles from "./HomePage.module.css";
import { useMarketStocks } from "../hooks/useMarketStocks";
import ErrorMessage from "../components/common/ErrorMessage";

function formatNumber(value: number | null, digits = 2): string {
  return value === null ? "N/A" : value.toFixed(digits);
}

function formatMarketCap(value: number | null): string {
  if (value === null) return "N/A";
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  return `${(value / 1e6).toFixed(2)}M`;
}

export default function HomePage() {
  const { stocks, loading, error } = useMarketStocks();

  return (
    <div className={styles.container}>
      <h1>Welcome to the Trading App</h1>
      <p>Use the navigation to view and manage your trades.</p>

      {loading && <p>Loading market stocks...</p>}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Exchange</th>
                <th>Price</th>
                <th>Change</th>
                <th>Change %</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const changeClass =
                  (stock.change ?? 0) >= 0 ? tableStyles.positive : tableStyles.negative;

                return (
                  <tr key={stock.symbol}>
                    <td className={tableStyles.symbol}>{stock.symbol}</td>
                    <td>{stock.companyName}</td>
                    <td>{stock.exchange ?? "N/A"}</td>
                    <td>
                      {formatNumber(stock.price)} {stock.currency ?? ""}
                    </td>
                    <td className={changeClass}>{formatNumber(stock.change)}</td>
                    <td className={changeClass}>
                      {formatNumber(stock.changePercent)}%
                    </td>
                    <td>{formatMarketCap(stock.marketCap)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
