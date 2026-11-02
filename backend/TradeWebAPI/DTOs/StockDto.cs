namespace TradeWebAPI.DTOs
{
    // A stock in the current user's list, with the price/quantity they plan to trade at
    public class StockDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Exchange { get; set; }
        public string? Sector { get; set; }
        public decimal EntryPrice { get; set; }
        public decimal Quantity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
