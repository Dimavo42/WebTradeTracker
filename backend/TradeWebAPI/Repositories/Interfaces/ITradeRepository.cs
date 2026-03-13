using TradeWebAPI.Entities;

namespace TradeWebAPI.Repositories.Interfaces
{
    public interface ITradeRepository
    {
        Task<IEnumerable<Trade>> GetAllAsync();

        Task<Trade?> GetByIdAsync(int id);

        Task AddAsync(Trade trade);

        void Update(Trade trade);

        Task<bool> DeleteTradesByStockSymbolAsync(string symbol);

    }
}
