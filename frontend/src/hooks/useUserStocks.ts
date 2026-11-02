import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  addUserTradeStock,
  removeTradeStock,
  setTradesStocks,
  updateTradeStock,
  type userTradeStocks,
} from "../features/userStocks";
import { getStocks, deleteStock, saveStock } from "../api/userStocksApi";

const SAVE_DELAY_MS = 500;

// Loads the logged-in user's selected stocks from the server whenever the token changes.
// Mount once, near the top of the app.
export function useLoadUserStocks() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    getStocks(token)
      .then((stocks) => {
        if (cancelled) return;
        dispatch(
          setTradesStocks(
            stocks.map((s) => ({
              id: s.symbol,
              symbol: s.symbol,
              name: s.companyName,
              entryPrice: s.entryPrice,
              quantity: s.quantity,
            }))
          )
        );
      })
      .catch((err: unknown) => {
        console.error("Failed to load selected stocks:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [token, dispatch]);
}

// Selected-stock actions: update Redux immediately, then persist to the server for this user.
export function useUserStocks() {
  const token = useAppSelector((state) => state.auth.token);
  const stocks = useAppSelector((state) => state.userTradeStocks);
  const dispatch = useAppDispatch();
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const timers = saveTimers.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  const persist = (stock: userTradeStocks) => {
    if (!token) return;
    saveStock(
      stock.symbol,
      { companyName: stock.name, entryPrice: stock.entryPrice, quantity: stock.quantity },
      token
    ).catch((err: unknown) => console.error("Failed to save selected stock:", err));
  };

  const addStock = (stock: userTradeStocks) => {
    dispatch(addUserTradeStock(stock));
    persist(stock);
  };

  // Typing in the price/quantity inputs fires on every keystroke, so saves are debounced
  const updateStock = (stock: userTradeStocks) => {
    dispatch(updateTradeStock(stock));
    clearTimeout(saveTimers.current[stock.symbol]);
    saveTimers.current[stock.symbol] = setTimeout(() => persist(stock), SAVE_DELAY_MS);
  };

  const removeStock = (stock: userTradeStocks) => {
    dispatch(removeTradeStock(stock));
    clearTimeout(saveTimers.current[stock.symbol]);
    if (!token) return;
    deleteStock(stock.symbol, token).catch((err: unknown) =>
      console.error("Failed to remove selected stock:", err)
    );
  };

  return { stocks, addStock, updateStock, removeStock };
}
