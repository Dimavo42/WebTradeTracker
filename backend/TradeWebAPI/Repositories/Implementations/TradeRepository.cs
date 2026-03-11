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

        public async Task<IEnumerable<Trade>> GetAllAsync()
        {
            return await _context.Trades.ToListAsync();
        }

        public void Update(Trade trade)
        {
            _context.Trades.Update(trade);
        }

        public async Task<Trade?> GetByIdAsync(int id)
        {
            return await _context.Trades.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task AddAsync(Trade trade)
        {
            await _context.Trades.AddAsync(trade);
        }

        public void Delete(Trade trade)
        {
            _context.Trades.Remove(trade);
        }

        public async Task<IEnumerable<Trade>> GetByStockIdAsync(int stockId)
        {
            return await _context.Trades
                .Where(t => t.StockId == stockId)
                .ToListAsync();
        }
    }
}
