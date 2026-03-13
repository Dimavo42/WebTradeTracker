using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Enums;

namespace TradeWebAPI.Services.Interfaces
{
    public interface  ITradeService
    {
        Task<AppStatus> CreateTradeAsync(CreateTradeDto dto);
        Task<IEnumerable<TradeDto>> GetTradesAsync();
        Task<TradeDto?> GetTradeByIdAsync(int id);

        Task<bool> DeleteTradeAsync(string symbol);
    }
}
