using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;

namespace TradeWebAPI.Services.Interfaces
{
    public interface  ITradeService
    {
        Task<ServiceResult<Trade>> CreateTradeAsync(CreateTradeDto dto);
        Task<ServiceResult<IEnumerable<TradeDto>>> GetTradesAsync();
        Task<ServiceResult<TradeDto>> GetTradeByIdAsync(int id);
        Task<ServiceResult<Trade>> UpdateTradeAsync(int id, UpdateTradeDto dto);
        Task<ServiceResult<bool>> DeleteTradeAsync(string symbol);
    }
}
