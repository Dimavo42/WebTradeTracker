using Microsoft.EntityFrameworkCore;
using TradeWebAPI.Entities;
using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories.Implementations
{
    public class TradeRepository : ITradeRepository
    {
        private readonly AppDbContext _context;

        public TradeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Trade>> GetAllTradesByUserIdAsync(int userId)
        {
            return await _context.Trades
                .AsNoTracking()
                .Include(t => t.Stock)
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public void Update(Trade trade)
        {
            _context.Trades.Update(trade);
        }

        public async Task<Trade?> GetByIdAsync(int id, int userId)
        {
            return await _context.Trades
                .Include(t => t.Stock)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task AddAsync(Trade trade)
        {
            await _context.Trades.AddAsync(trade);
        }

        public async Task<bool> DeleteTradesByStockSymbolAsync(string symbol, int userId)
        {
            var trades = await _context.Trades
                .Where(t => t.Stock.Symbol == symbol && t.UserId == userId)
                .ToListAsync();

            if (!trades.Any())
                return false;

            _context.Trades.RemoveRange(trades);

            return true;
        }
    }
}
