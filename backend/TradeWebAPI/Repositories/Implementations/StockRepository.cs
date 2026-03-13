using Microsoft.EntityFrameworkCore;
using TradeWebAPI.Entities;
using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories.Implementations
{
    public class StockRepository : IStockRepository
    {
        private readonly AppDbContext _context;

        public StockRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Stock>> GetAllAsync()
        {
            return await _context.Stocks.AsNoTracking().ToListAsync();
        }

        public async Task<Stock?> GetByIdAsync(int id)
        {
            return await _context.Stocks
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Stock?> GetBySymbolAsync(string symbol)
        {
            return await _context.Stocks
                .FirstOrDefaultAsync(s => s.Symbol == symbol);
        }

        public async Task<bool> ExistsBySymbolAsync(string symbol)
        {
            return await _context.Stocks
                .AnyAsync(s => s.Symbol == symbol);
        }

        public async Task AddAsync(Stock stock)
        {
            await _context.Stocks.AddAsync(stock);
        }

        public void Update(Stock stock)
        {
            _context.Stocks.Update(stock);
        }

        public void Delete(Stock stock)
        {
            _context.Stocks.Remove(stock);
        }
    }
}
