using TradeWebAPI.DTOs;

namespace TradeWebAPI.Services.Interfaces
{
    public interface IStockService
    {
        Task<IEnumerable<StockDto>> GetStocksAsync();
        Task<StockDto?> GetStockByIdAsync(int id);
        Task<StockDto> CreateStockAsync(CreateStockDto dto);
        Task<bool> DeleteStockAsync(int id);
    }
}
