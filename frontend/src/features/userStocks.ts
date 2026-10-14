import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type userTradeStocks = {
  id: string;
  symbol: string;
  name: string;
  entryPrice: number;
  quantity: number;
};


const userTradeStocksSlice = createSlice({
  name: "userTradeStocks",
  initialState: [] as userTradeStocks[],
  reducers: {
    setTradesStocks(_state, action: PayloadAction<userTradeStocks[]>) {
      return action.payload;
    },
    addUserTradeStock(state, action: PayloadAction<userTradeStocks>) {
      state.push(action.payload);
    },
    removeTradeStock(state, action: PayloadAction<userTradeStocks>) {
      return state.filter(stock => stock.id !== action.payload.id);
    },
    updateTradeStock(state, action: PayloadAction<userTradeStocks>) {
      const index = state.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }   
  },
}});


export const { setTradesStocks, addUserTradeStock, removeTradeStock, updateTradeStock} = userTradeStocksSlice.actions;
export default userTradeStocksSlice.reducer;
