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

        public async Task<ServiceResult<TradeDto>> CreateTradeAsync(CreateTradeDto createTradeDto)
        {
            _logger.LogInformation("TradeService.CreateTradeAsync started.");

            var validationStatus = await _tradeValidator.ValidateCreateTradeAsync(createTradeDto);

            if (validationStatus != AppStatus.Success)
            {
                _logger.LogWarning("Trade validation failed. Status: {Status}", validationStatus);
                return ServiceResult<TradeDto>.Failure(validationStatus);
            }

            var trade = _mapper.Map<Trade>(createTradeDto);
            trade.EntryDate = trade.EntryDate == default ? DateTime.UtcNow : trade.EntryDate;
            trade.CreatedAt = DateTime.UtcNow;
            trade.Status = string.IsNullOrWhiteSpace(trade.Status) ? "Open" : trade.Status;

            await _unitOfWork.Trades.AddAsync(trade);
            await _unitOfWork.CompleteAsync();

            var tradeDto = _mapper.Map<TradeDto>(trade);

            return ServiceResult<TradeDto>.Success(tradeDto);
        }

        public async Task<bool> DeleteTradeAsync(int id)
        {
            _logger.LogInformation("TradeService.DeleteTradeAsync started. TradeId: {TradeId}", id);

            var trade = await _unitOfWork.Trades.GetByIdAsync(id);
            if (trade == null)
            {
                _logger.LogWarning("TradeService.DeleteTradeAsync: Trade not found. TradeId: {TradeId}", id);
                return false;
            }

            _unitOfWork.Trades.Delete(trade);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("TradeService.DeleteTradeAsync completed. TradeId: {TradeId}", id);
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
