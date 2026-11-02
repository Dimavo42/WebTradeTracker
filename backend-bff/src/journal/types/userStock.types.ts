// A stock in the logged-in user's own list (GET /api/stocks on the .NET API)
export interface UserStock {
  id: number;
  symbol: string;
  companyName: string;
  entryPrice: number;
  quantity: number;
}
