using Microsoft.EntityFrameworkCore;
using TradeWebAPI.DTOs;
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
            return await _context.Trades.Include(t => t.Stock).ToListAsync();
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


        public async Task<IEnumerable<Trade>> GetByStockIdAsync(int stockId)
        {
            return await _context.Trades
                .Where(t => t.StockId == stockId)
                .ToListAsync();
        }

        public async Task<bool> DeleteTradesByStockSymbolAsync(string symbol)
        {
            var trades = await _context.Trades
                .Where(t => t.Stock.Symbol == symbol)
                .ToListAsync();

            if (!trades.Any())
                return false;

            _context.Trades.RemoveRange(trades);

            return true;
        }

    }
}
