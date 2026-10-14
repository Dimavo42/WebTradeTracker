import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userTradeStocksReducer from "../features/userStocks";


export const store = configureStore({
    reducer:{
        auth: authReducer,
        userTradeStocks: userTradeStocksReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;