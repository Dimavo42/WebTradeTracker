using TradeWebAPI.Entities;

namespace TradeWebAPI.Repositories.Interfaces
{
    // Every query is scoped to one user so a trade can never leak to another account
    public interface ITradeRepository
    {
        Task<IEnumerable<Trade>> GetAllTradesByUserIdAsync(int userId);

        Task<Trade?> GetByIdAsync(int id, int userId);

        Task AddAsync(Trade trade);

        void Update(Trade trade);

        Task<bool> DeleteTradesByStockSymbolAsync(string symbol, int userId);

    }
}
