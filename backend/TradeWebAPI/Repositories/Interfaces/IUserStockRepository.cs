using TradeWebAPI.Entities;

namespace TradeWebAPI.Repositories.Interfaces
{
    // Every query is scoped to one user's own stock list
    public interface IUserStockRepository
    {
        Task<IEnumerable<UserStock>> GetByUserIdAsync(int userId);

        Task<UserStock?> GetByStockIdAsync(int userId, int stockId);

        Task<UserStock?> GetBySymbolAsync(int userId, string symbol);

        Task AddAsync(UserStock userStock);

        void Delete(UserStock userStock);
    }
}
