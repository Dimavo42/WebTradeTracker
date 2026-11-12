namespace TradeWebAPI.DTOs
{
    public class SupportRequestDto
    {
        public Guid ConversationId { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
