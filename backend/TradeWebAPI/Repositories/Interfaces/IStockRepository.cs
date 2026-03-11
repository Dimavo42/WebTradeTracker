using TradeWebAPI.Entities;

namespace TradeWebAPI.Repositories.Interfaces
{
    public interface IStockRepository
    {
        Task<IEnumerable<Stock>> GetAllAsync();

        Task<Stock?> GetByIdAsync(int id);

        Task<Stock?> GetBySymbolAsync(string symbol);

        Task<bool> ExistsBySymbolAsync(string symbol);

        Task AddAsync(Stock stock);

        void Update(Stock stock);

        void Delete(Stock stock);
    }
}
