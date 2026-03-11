namespace TradeWebAPI.DTOs
{
    public class TradeDto
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public string TradeType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal EntryPrice { get; set; }
        public decimal? ExitPrice { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime? ExitDate { get; set; }
        public decimal Fees { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
