using TradeWebAPI.Common;
using TradeWebAPI.DTOs;

namespace TradeWebAPI.Services.Interfaces
{
    public interface IStockService
    {
        Task<ServiceResult<IEnumerable<StockDto>>> GetStocksAsync();
        Task<ServiceResult<StockDto>> GetStockByIdAsync(int id);
        Task<ServiceResult<StockDto>> CreateStockAsync(CreateStockDto dto);
        Task<ServiceResult<bool>> DeleteStockAsync(int id);
    }
}
