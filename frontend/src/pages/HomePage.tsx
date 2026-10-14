import styles from "./TradesPage.module.css";
import tableStyles from "./HomePage.module.css";
import { useMarketStocks } from "../hooks/useMarketStocks";
import { useTrades } from "../hooks/useTrades";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import Button from "../components/common/Button";
import {
  addUserTradeStock,
  removeTradeStock,
} from "../features/userStocks";
import type { MarketStock } from "../types/stock";

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
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);
  const token = useAppSelector((state) => state.auth.token);
  const userStocks = useAppSelector((state) => state.userTradeStocks);
  const dispatch = useAppDispatch();
  const { trades, deleteTrade, error: tradesError } = useTrades(token);

  const journalSymbols = new Set(trades.map((t) => t.symbol));

  const handleRemoveFromJournal = async (stock: MarketStock) => {
    const count = trades.filter((t) => t.symbol === stock.symbol).length;
    const confirmed = window.confirm(
      `Delete all ${count} trade(s) for ${stock.symbol} from your journal? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteTrade(stock.symbol);

      const existing = userStocks.find((s) => s.symbol === stock.symbol);
      if (existing) {
        dispatch(removeTradeStock(existing));
      }
    } catch {
      // error already handled in hook
    }
  };

  const handleToggleStock = (stock: MarketStock) => {
    const existing = userStocks.find((s) => s.symbol === stock.symbol);

    if (existing) {
      dispatch(removeTradeStock(existing));
      return;
    }

    dispatch(
      addUserTradeStock({
        id: stock.symbol,
        symbol: stock.symbol,
        name: stock.companyName,
        entryPrice: stock.price ?? 0,
        quantity: 0,
      })
    );
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to the Trading App</h1>
      <p>Use the navigation to view and manage your trades.</p>

      {loading && <p>Loading market stocks...</p>}

      {error && <ErrorMessage message={error} />}

      {isLoggedIn && tradesError && <ErrorMessage message={tradesError} />}

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
                {isLoggedIn && <th>Add To Journal</th>}
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
                    {isLoggedIn && (
                      <td>
                        {journalSymbols.has(stock.symbol) ? (
                          <div className={tableStyles.journalCell}>
                            <span className={tableStyles.inJournal}>
                              In Journal ✓
                            </span>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => void handleRemoveFromJournal(stock)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : userStocks.some((s) => s.symbol === stock.symbol) ? (
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleToggleStock(stock)}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="small"
                            onClick={() => handleToggleStock(stock)}
                          >
                            Add
                          </Button>
                        )}
                      </td>
                    )}
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
