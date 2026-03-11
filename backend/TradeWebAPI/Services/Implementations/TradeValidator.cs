using TradeWebAPI.DTOs;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class TradeValidator : ITradeValidator
    {
        private readonly IUnitOfWork _unitOfWork;


        public TradeValidator(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<AppStatus> ValidateCreateTradeAsync(CreateTradeDto dto)
        {
            if (dto == null)
                return AppStatus.InvalidRequest;

            if (dto.Quantity <= 0)
                return AppStatus.InvalidQuantity;

            if (dto.Price <= 0)
                return AppStatus.InvalidPrice;

            if (dto.TradeDate > DateTime.UtcNow)
                return AppStatus.InvalidTradeDate;

            var stockExists = await _unitOfWork.Stocks
                .ExistsBySymbolAsync(dto.StockSymbol);

            if (!stockExists)
                return AppStatus.StockNotFound;

            return AppStatus.Success;
        }

    }
}
