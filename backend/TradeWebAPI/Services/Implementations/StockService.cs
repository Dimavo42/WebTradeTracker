using AutoMapper;
using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    // Works only on the calling user's own stock list. The shared Stock rows are never
    // deleted here, so one user can't remove stocks (or trades) from anyone else.
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

        public async Task<ServiceResult<IEnumerable<StockDto>>> GetStocksAsync(int userId)
        {
            _logger.LogInformation("StockService.GetStocksAsync started. UserId: {UserId}", userId);
            var userStocks = await _unitOfWork.UserStocks.GetByUserIdAsync(userId);
            var result = _mapper.Map<List<StockDto>>(userStocks);
            _logger.LogInformation("StockService.GetStocksAsync completed. Count: {Count}", result.Count);
            return ServiceResult<IEnumerable<StockDto>>.Success(result);
        }

        public async Task<ServiceResult<StockDto>> GetStockByIdAsync(int id, int userId)
        {
            _logger.LogInformation("StockService.GetStockByIdAsync started. StockId: {StockId}", id);
            var userStock = await _unitOfWork.UserStocks.GetByStockIdAsync(userId, id);
            if (userStock == null)
            {
                _logger.LogWarning("StockService.GetStockByIdAsync: Stock not in user's list. StockId: {StockId}", id);
                return ServiceResult<StockDto>.Failure(AppStatus.NotFound);
            }
            return ServiceResult<StockDto>.Success(_mapper.Map<StockDto>(userStock));
        }

        public async Task<ServiceResult<StockDto>> CreateStockAsync(CreateStockDto dto, int userId)
        {
            _logger.LogInformation(
                "StockService.CreateStockAsync started. Symbol: {Symbol}, CompanyName: {CompanyName}",
                dto.Symbol,
                dto.CompanyName);

            return await SaveStockAsync(
                dto.Symbol,
                new SaveStockDto { CompanyName = dto.CompanyName },
                userId);
        }

        // Adds the stock to the user's list, or updates its price/quantity if it's already there
        public async Task<ServiceResult<StockDto>> SaveStockAsync(string symbol, SaveStockDto dto, int userId)
        {
            if (string.IsNullOrWhiteSpace(symbol) || dto.EntryPrice < 0 || dto.Quantity < 0)
            {
                return ServiceResult<StockDto>.Failure(AppStatus.InvalidRequest);
            }

            var normalizedSymbol = symbol.Trim().ToUpper();
            var companyName = string.IsNullOrWhiteSpace(dto.CompanyName)
                ? normalizedSymbol
                : dto.CompanyName.Trim();

            var userStock = await _unitOfWork.UserStocks.GetBySymbolAsync(userId, normalizedSymbol);

            if (userStock == null)
            {
                var stock = await _unitOfWork.Stocks.GetBySymbolAsync(normalizedSymbol);
                if (stock == null)
                {
                    stock = new Stock { Symbol = normalizedSymbol, CompanyName = companyName };
                    await _unitOfWork.Stocks.AddAsync(stock);
                }
                else if (stock.CompanyName == stock.Symbol && companyName != normalizedSymbol)
                {
                    // Trades create stocks with the symbol as a placeholder name
                    stock.CompanyName = companyName;
                }

                userStock = new UserStock { UserId = userId, Stock = stock };
                await _unitOfWork.UserStocks.AddAsync(userStock);
            }

            userStock.EntryPrice = dto.EntryPrice;
            userStock.Quantity = dto.Quantity;

            await _unitOfWork.CompleteAsync();

            _logger.LogInformation(
                "StockService.SaveStockAsync completed. UserId: {UserId}, Symbol: {Symbol}",
                userId,
                normalizedSymbol);
            return ServiceResult<StockDto>.Success(_mapper.Map<StockDto>(userStock));
        }

        public async Task<ServiceResult<bool>> DeleteStockAsync(int id, int userId)
        {
            _logger.LogInformation("StockService.DeleteStockAsync started. StockId: {StockId}", id);
            var userStock = await _unitOfWork.UserStocks.GetByStockIdAsync(userId, id);
            return await RemoveAsync(userStock);
        }

        public async Task<ServiceResult<bool>> DeleteStockBySymbolAsync(string symbol, int userId)
        {
            _logger.LogInformation("StockService.DeleteStockBySymbolAsync started. Symbol: {Symbol}", symbol);
            var userStock = await _unitOfWork.UserStocks.GetBySymbolAsync(userId, symbol.Trim().ToUpper());
            return await RemoveAsync(userStock);
        }

        private async Task<ServiceResult<bool>> RemoveAsync(UserStock? userStock)
        {
            if (userStock == null)
            {
                return ServiceResult<bool>.Failure(AppStatus.NotFound);
            }

            _unitOfWork.UserStocks.Delete(userStock);
            await _unitOfWork.CompleteAsync();
            return ServiceResult<bool>.Success(true);
        }
    }
}
