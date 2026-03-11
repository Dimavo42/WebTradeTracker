namespace TradeWebAPI.DTOs
{
    public class CreateTradeDto
    {
        public int StockId { get; set; }
        public string TradeType { get; set; }
        public int Quantity { get; set; }
        public decimal EntryPrice { get; set; }

        public string StockSymbol { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public DateTime TradeDate { get; set; }
       
    }
}
