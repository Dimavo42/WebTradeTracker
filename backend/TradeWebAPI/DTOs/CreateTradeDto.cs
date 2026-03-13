namespace TradeWebAPI.DTOs
{
    public class CreateTradeDto
    {
        public string StockSymbol { get; set; } = string.Empty;
        public string TradeType { get; set; } = string.Empty; // Buy / Sell
        public string Status { get; set; } = "Open";          // Open / Closed
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Fees { get; set; }
        public DateTime TradeDate { get; set; }

    }
}
