using AutoMapper;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Repositories;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class StockService: IStockService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<StockService> _logger;
        private readonly IMapper _mapper;

        public StockService(
            IUnitOfWork unitOfWork,
            ILogger<StockService> logger,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<StockDto>> GetStocksAsync()
        {
            _logger.LogInformation("StockService.GetStocksAsync started.");
            var stocks = await _unitOfWork.Stocks.GetAllAsync();
            var result = _mapper.Map<List<StockDto>>(stocks);
            _logger.LogInformation("StockService.GetStocksAsync completed. Count: {Count}", result.Count);
            return result;
        }

        public async Task<StockDto?> GetStockByIdAsync(int id)
        {
            _logger.LogInformation("StockService.GetStockByIdAsync started. StockId: {StockId}", id);
            var stock = await _unitOfWork.Stocks.GetByIdAsync(id);
            if (stock == null)
            {
                _logger.LogWarning("StockService.GetStockByIdAsync: Stock not found. StockId: {StockId}", id);
                return null;
            }
            var result = _mapper.Map<StockDto>(stock);
            _logger.LogInformation("StockService.GetStockByIdAsync completed. StockId: {StockId}", id);
            return result;
        }

        public async Task<StockDto> CreateStockAsync(CreateStockDto dto)
        {
            _logger.LogInformation(
                "StockService.CreateStockAsync started. Symbol: {Symbol}, CompanyName: {CompanyName}",
                dto.Symbol,
                dto.CompanyName);
            var stock = _mapper.Map<Stock>(dto);
            stock.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.Stocks.AddAsync(stock);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation(
                "StockService.CreateStockAsync completed. StockId: {StockId}, Symbol: {Symbol}",
                stock.Id,
                stock.Symbol);

            return _mapper.Map<StockDto>(stock);
        }

        public async Task<bool> DeleteStockAsync(int id)
        {
            _logger.LogInformation("StockService.DeleteStockAsync started. StockId: {StockId}", id);
            var stock = await _unitOfWork.Stocks.GetByIdAsync(id);
            if (stock == null)
            {
                _logger.LogWarning("StockService.DeleteStockAsync: Stock not found. StockId: {StockId}", id);
                return false;
            }
            _unitOfWork.Stocks.Delete(stock);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("StockService.DeleteStockAsync completed. StockId: {StockId}", id);
            return true;
        }
    }
}
