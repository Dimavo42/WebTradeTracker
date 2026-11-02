namespace TradeWebAPI.Entities
{
    // A stock the user selected for their journal, with the draft price/quantity
    // they are planning to trade at. The Stock row itself is shared by all users.
    public class UserStock
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int StockId { get; set; }
        public Stock Stock { get; set; } = null!;

        public decimal EntryPrice { get; set; }
        public decimal Quantity { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
