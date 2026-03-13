using AutoMapper;
using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class TradeService : ITradeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<TradeService> _logger;
        private readonly IMapper _mapper;
        private readonly ITradeValidator _tradeValidator;

        public TradeService(
            IUnitOfWork unitOfWork,
            ILogger<TradeService> logger,
            IMapper mapper,
            ITradeValidator tradeValidator)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _tradeValidator = tradeValidator;
        }

        public async Task<AppStatus> CreateTradeAsync(CreateTradeDto dto)
        {
            _logger.LogInformation("TradeService.CreateTradeAsync started.");

            var validationStatus = await _tradeValidator.ValidateCreateTradeAsync(dto);
            if (validationStatus != AppStatus.Success)
            {
                _logger.LogWarning("Trade validation failed. Status: {Status}", validationStatus);
                return validationStatus;
            }

            var normalizedSymbol = dto.StockSymbol.Trim().ToUpper();

            var stock = await _unitOfWork.Stocks.GetBySymbolAsync(normalizedSymbol);

            if (stock == null)
            {
                stock = new Stock
                {
                    Symbol = normalizedSymbol,
                    CompanyName = normalizedSymbol
                };

                await _unitOfWork.Stocks.AddAsync(stock);
            }

            var trade = new Trade
            {
                Stock = stock,
                Quantity = dto.Quantity,
                EntryPrice = dto.Price,
                EntryDate = dto.TradeDate,
                TradeType = dto.TradeType
            };

            await _unitOfWork.Trades.AddAsync(trade);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("TradeService.CreateTradeAsync completed successfully.");
            return AppStatus.Success;
        }

        public async Task<bool> DeleteTradeAsync(string symbol)
        {
            _logger.LogInformation("DeleteTradeAsync started. Symbol: {Symbol}", symbol);

            if (string.IsNullOrWhiteSpace(symbol))
            {
                _logger.LogWarning("DeleteTradeAsync failed: symbol is empty.");
                return false;
            }

            symbol = symbol.Trim().ToUpper();

            var deleted = await _unitOfWork.Trades.DeleteTradesByStockSymbolAsync(symbol);

            if (!deleted)
            {
                _logger.LogWarning("DeleteTradeAsync: No trades found for symbol: {Symbol}", symbol);
                return false;
            }

            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("DeleteTradeAsync completed. Symbol: {Symbol}", symbol);

            return true;
        }
        

        public async Task<TradeDto?> GetTradeByIdAsync(int id)
        {
            _logger.LogInformation("TradeService.GetTradeByIdAsync started. TradeId: {TradeId}", id);

            var trade = await _unitOfWork.Trades.GetByIdAsync(id);
            if (trade == null)
            {
                _logger.LogWarning("TradeService.GetTradeByIdAsync: Trade not found. TradeId: {TradeId}", id);
                return null;
            }

            return _mapper.Map<TradeDto>(trade);
        }

        public async Task<IEnumerable<TradeDto>> GetTradesAsync()
        {
            _logger.LogInformation("TradeService.GetTradesAsync started.");

            var trades = await _unitOfWork.Trades.GetAllAsync();
            var result = _mapper.Map<List<TradeDto>>(trades);

            _logger.LogInformation("TradeService.GetTradesAsync completed. Count: {Count}", result.Count);

            return result;
        }
    }
}
