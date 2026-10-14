import { useAppSelector } from "../hooks/reduxHooks";
import { useTrades } from "../hooks/useTrades";
import { useMarketStocks } from "../hooks/useMarketStocks";
import ErrorMessage from "../components/common/ErrorMessage";
import StockCard from "../components/stock/StockCard";
import styles from "./StockPage.module.css";

export default function StockPage() {
  const token = useAppSelector((state) => state.auth.token);
  const userStocks = useAppSelector((state) => state.userTradeStocks);
  const { trades, loading, error } = useTrades(token);
  const { stocks: marketStocks } = useMarketStocks();

  const symbols = [
    ...new Set([
      ...userStocks.map((s) => s.symbol),
      ...trades.map((t) => t.symbol),
    ]),
  ].sort();

  const marketBySymbol = new Map(marketStocks.map((s) => [s.symbol, s]));

  if (loading) {
    return <p className={styles.message}>Loading stocks...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📈 Stocks</h2>

      {error && <ErrorMessage message={error} />}

      {!error && symbols.length === 0 ? (
        <p className={styles.message}>
          No stocks yet. Add stocks from the Home page or add trades in the
          Trades Journal.
        </p>
      ) : (
        <div className={styles.grid}>
          {symbols.map((symbol) => {
            const market = marketBySymbol.get(symbol);
            const selected = userStocks.find((s) => s.symbol === symbol);

            return (
              <StockCard
                key={symbol}
                symbol={symbol}
                name={market?.companyName ?? selected?.name ?? null}
                price={market?.price ?? null}
                currency={market?.currency ?? null}
                changePercent={market?.changePercent ?? null}
                tradeCount={trades.filter((t) => t.symbol === symbol).length}
                isSelected={!!selected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
