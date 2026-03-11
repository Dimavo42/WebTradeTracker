namespace TradeWebAPI.Entities
{
    public class Trade
    {
        public int Id { get; set; }

        public int StockId { get; set; }
        public Stock Stock { get; set; }

        public string TradeType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }

        public decimal EntryPrice { get; set; }
        public decimal? ExitPrice { get; set; }

        public DateTime EntryDate { get; set; }
        public DateTime? ExitDate { get; set; }

        public decimal Fees { get; set; }
        public string Status { get; set; } = "Open";
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
