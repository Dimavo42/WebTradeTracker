using Microsoft.EntityFrameworkCore;
using TradeWebAPI.Entities;
using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories.Implementations
{
    public class SupportRequestRepository : ISupportRequestRepository
    {
        private readonly AppDbContext _context;

        public SupportRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        // Everyone waiting, oldest first
        public async Task<IEnumerable<SupportRequest>> GetAllAsync()
        {
            return await _context.SupportRequests
                .AsNoTracking()
                .Include(s => s.User)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<SupportRequest?> GetByUserIdAsync(int userId)
        {
            return await _context.SupportRequests
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public async Task<SupportRequest?> GetByConversationIdAsync(Guid conversationId)
        {
            return await _context.SupportRequests
                .FirstOrDefaultAsync(s => s.ConversationId == conversationId);
        }

        public async Task AddAsync(SupportRequest request)
        {
            await _context.SupportRequests.AddAsync(request);
        }

        public void Remove(SupportRequest request)
        {
            _context.SupportRequests.Remove(request);
        }
    }
}
