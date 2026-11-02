using TradeWebAPI.Common;
using TradeWebAPI.DTOs;

namespace TradeWebAPI.Services.Interfaces
{
    // Each user has their own stock list; userId comes from the request's JWT (BaseController.GetCurrentUserId)
    public interface IStockService
    {
        Task<ServiceResult<IEnumerable<StockDto>>> GetStocksAsync(int userId);
        Task<ServiceResult<StockDto>> GetStockByIdAsync(int id, int userId);
        Task<ServiceResult<StockDto>> CreateStockAsync(CreateStockDto dto, int userId);
        Task<ServiceResult<StockDto>> SaveStockAsync(string symbol, SaveStockDto dto, int userId);
        Task<ServiceResult<bool>> DeleteStockAsync(int id, int userId);
        Task<ServiceResult<bool>> DeleteStockBySymbolAsync(string symbol, int userId);
    }
}
