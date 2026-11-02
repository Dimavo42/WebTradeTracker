using Microsoft.EntityFrameworkCore;
using TradeWebAPI.Entities;
using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories.Implementations
{
    public class UserStockRepository : IUserStockRepository
    {
        private readonly AppDbContext _context;

        public UserStockRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserStock>> GetByUserIdAsync(int userId)
        {
            return await _context.UserStocks
                .AsNoTracking()
                .Include(us => us.Stock)
                .Where(us => us.UserId == userId)
                .OrderBy(us => us.CreatedAt)
                .ToListAsync();
        }

        public async Task<UserStock?> GetByStockIdAsync(int userId, int stockId)
        {
            return await _context.UserStocks
                .Include(us => us.Stock)
                .FirstOrDefaultAsync(us => us.UserId == userId && us.StockId == stockId);
        }

        public async Task<UserStock?> GetBySymbolAsync(int userId, string symbol)
        {
            return await _context.UserStocks
                .Include(us => us.Stock)
                .FirstOrDefaultAsync(us => us.UserId == userId && us.Stock.Symbol == symbol);
        }

        public async Task AddAsync(UserStock userStock)
        {
            await _context.UserStocks.AddAsync(userStock);
        }

        public void Delete(UserStock userStock)
        {
            _context.UserStocks.Remove(userStock);
        }
    }
}
