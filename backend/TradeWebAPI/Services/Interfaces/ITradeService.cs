using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Services.Interfaces
{
    // userId comes from the request's JWT (BaseController.GetCurrentUserId), never from the body
    public interface  ITradeService
    {
        Task<ServiceResult<Trade>> CreateTradeAsync(CreateTradeDto dto, int userId);
        Task<ServiceResult<IEnumerable<TradeDto>>> GetTradesAsync(int userId);
        Task<ServiceResult<TradeDto>> GetTradeByIdAsync(int id, int userId);
        Task<ServiceResult<Trade>> UpdateTradeAsync(int id, UpdateTradeDto dto, int userId);
        Task<ServiceResult<bool>> DeleteTradeAsync(string symbol, int userId);
    }
}
