namespace TradeWebAPI.Entities
{
    public class Stock
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Exchange { get; set; }
        public string? Sector { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Trade> Trades { get; set; } = new List<Trade>();
    }
}
