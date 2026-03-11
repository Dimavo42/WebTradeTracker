using TradeWebAPI.DTOs;
using TradeWebAPI.Enums;

namespace TradeWebAPI.Services.Interfaces
{
    public interface ITradeValidator
    {
        Task<AppStatus> ValidateCreateTradeAsync(CreateTradeDto dto);
    }
}
