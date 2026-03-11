namespace TradeWebAPI.DTOs
{
    public class StockDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Exchange { get; set; }
        public string? Sector { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
