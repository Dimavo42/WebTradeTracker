using TradeWebAPI.Common;
using TradeWebAPI.DTOs;

namespace TradeWebAPI.Services.Interfaces
{
    public interface  ITradeService
    {
        Task<IEnumerable<TradeDto>> GetTradesAsync();
        Task<TradeDto?> GetTradeByIdAsync(int id);

        Task<ServiceResult<TradeDto>> CreateTradeAsync(CreateTradeDto createTradeDto);

        Task<bool> DeleteTradeAsync(int id);
    }
}
