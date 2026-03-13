namespace TradeWebAPI.DTOs
{
    public class UpdateTradeDto
    {
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Fees { get; set; }
        public string Status { get; set; } = "";
        public DateTime TradeDate { get; set; }
    }
}
