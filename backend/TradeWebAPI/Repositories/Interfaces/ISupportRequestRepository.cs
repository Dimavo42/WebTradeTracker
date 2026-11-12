using TradeWebAPI.Entities;

namespace TradeWebAPI.Repositories.Interfaces
{
    public interface ISupportRequestRepository
    {
        Task<IEnumerable<SupportRequest>> GetAllAsync();
        Task<SupportRequest?> GetByUserIdAsync(int userId);
        Task<SupportRequest?> GetByConversationIdAsync(Guid conversationId);
        Task AddAsync(SupportRequest request);
        void Remove(SupportRequest request);
    }
}
