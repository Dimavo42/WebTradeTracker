namespace TradeWebAPI.DTOs
{
    public class CreateStockDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Exchange { get; set; }
        public string? Sector { get; set; }
    }
}
