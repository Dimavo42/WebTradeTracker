using AutoMapper;
using System.Collections.Generic;
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
        private readonly ITradeProducer _tradeProducer;

        public TradeService(
            IUnitOfWork unitOfWork,
            ILogger<TradeService> logger,
            IMapper mapper, 
            ITradeValidator tradeValidator,
            ITradeProducer tradeProducer)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _tradeValidator = tradeValidator;
            _tradeProducer = tradeProducer;
        }


        public async Task<ServiceResult<Trade>> UpdateTradeAsync(int id, UpdateTradeDto dto)
        {
            var trade = await _unitOfWork.Trades.GetByIdAsync(id);

            if (trade == null)
                return ServiceResult<Trade>.Failure(AppStatus.NotFound);

            trade.Quantity = dto.Quantity;
            trade.Fees = dto.Fees;
            trade.Status = dto.Status;

            if (trade.TradeType == "Buy")
            {
                trade.EntryPrice = dto.Price;
                trade.EntryDate = dto.TradeDate;
            }
            else
            {
                trade.ExitPrice = dto.Price;
                trade.ExitDate = dto.TradeDate;
            }

            await _unitOfWork.CompleteAsync();

            return ServiceResult<Trade>.Success(trade);
        }

        public async Task<ServiceResult<Trade>> CreateTradeAsync(CreateTradeDto dto)
        {
            _logger.LogInformation("TradeService.CreateTradeAsync started.");

            var validationStatus = await _tradeValidator.ValidateCreateTradeAsync(dto);
            if (validationStatus != AppStatus.Success)
            {
                _logger.LogWarning("Trade validation failed. Status: {Status}", validationStatus);
                return ServiceResult<Trade>.Failure(AppStatus.InternalError);
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
                TradeType = dto.TradeType,
                Status = dto.Status,
                Fees = dto.Fees,
                CreatedAt = DateTime.UtcNow
            };

            if (dto.TradeType == "Buy")
            {
                trade.EntryPrice = dto.Price;
                trade.EntryDate = dto.TradeDate;
                trade.ExitPrice = null;
                trade.ExitDate = null;
            }
            else if (dto.TradeType == "Sell")
            {
                trade.EntryPrice = 0;
                trade.EntryDate = dto.TradeDate;
                trade.ExitPrice = dto.Price;
                trade.ExitDate = dto.TradeDate;
            }
            else
            {
                _logger.LogWarning("Invalid trade type: {TradeType}", dto.TradeType);
                return ServiceResult<Trade>.Failure(AppStatus.InvalidRequest);
            }
            await _unitOfWork.Trades.AddAsync(trade);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("TradeService.CreateTradeAsync completed successfully.");
            await _tradeProducer.PublishTrade(trade);
            return ServiceResult<Trade>.Success(trade);
        }

        public async Task<ServiceResult<bool>> DeleteTradeAsync(string symbol)
        {
            _logger.LogInformation("DeleteTradeAsync started. Symbol: {Symbol}", symbol);

            if (string.IsNullOrWhiteSpace(symbol))
            {
                _logger.LogWarning("DeleteTradeAsync failed: symbol is empty.");
                return ServiceResult<bool>.Failure(AppStatus.StockNotFound);
            }

            symbol = symbol.Trim().ToUpper();

            var deleted = await _unitOfWork.Trades.DeleteTradesByStockSymbolAsync(symbol);

            if (!deleted)
            {
                _logger.LogWarning("DeleteTradeAsync: No trades found for symbol: {Symbol}", symbol);
                return ServiceResult<bool>.Failure(AppStatus.InternalError);
            }

            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("DeleteTradeAsync completed. Symbol: {Symbol}", symbol);

            return  ServiceResult<bool>.Success(true);
        }
        

        public async Task<ServiceResult<TradeDto>> GetTradeByIdAsync(int id)
        {
            _logger.LogInformation("TradeService.GetTradeByIdAsync started. TradeId: {TradeId}", id);

            var trade = await _unitOfWork.Trades.GetByIdAsync(id);
            if (trade == null)
            {
                _logger.LogWarning("TradeService.GetTradeByIdAsync: Trade not found. TradeId: {TradeId}", id);
                return ServiceResult<TradeDto>.Failure(AppStatus.NotFound);
            }
            return ServiceResult<TradeDto>.Success(_mapper.Map<TradeDto>(trade));
        }

        public async Task<ServiceResult<IEnumerable<TradeDto>>> GetTradesAsync()
        {
            _logger.LogInformation("TradeService.GetTradesAsync started.");

            var trades = await _unitOfWork.Trades.GetAllAsync();
            var result = _mapper.Map<List<TradeDto>>(trades);

            _logger.LogInformation("TradeService.GetTradesAsync completed. Count: {Count}", result.Count);

            return ServiceResult<IEnumerable<TradeDto>>.Success(result);
        }
    }
}
