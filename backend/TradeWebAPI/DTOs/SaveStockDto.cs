namespace TradeWebAPI.DTOs
{
    // Body of PUT /api/stocks/{symbol}; the symbol itself comes from the route
    public class SaveStockDto
    {
        public string? CompanyName { get; set; }
        public decimal EntryPrice { get; set; }
        public decimal Quantity { get; set; }
    }
}
