using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeWebAPI.DTOs;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Controllers
{
    // Every endpoint works on the logged-in user's own stock list
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StocksController : BaseController
    {
        private readonly ILogger<StocksController> _logger;

        private readonly IStockService _stockService;
        public StocksController(ILogger<StocksController> logger, IStockService stockService) : base(logger)
        {
            _logger = logger;
            _stockService = stockService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStocks()
        {
            try
            {
                _logger.LogInformation("StocksController.GetStocks started.");

                var stocks = await _stockService.GetStocksAsync(GetCurrentUserId());

                _logger.LogInformation("StocksController.GetStocks completed successfully.");

                return Ok(stocks.Data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching stocks.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetStock(int id)
        {
            _logger.LogInformation("GetStock called. StockId: {StockId}", id);
            try
            {
                var stock = await _stockService.GetStockByIdAsync(id, GetCurrentUserId());
                if (!stock.IsSuccess)
                {
                    _logger.LogWarning("GetStock failed. Stock not found. StockId: {StockId}", id);
                    return NotFound();
                }
                return Ok(stock.Data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching stock. StockId: {StockId}", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateStock(CreateStockDto dto)
        {
            try
            {
                _logger.LogInformation(
                    "StocksController.CreateStock started. Symbol: {Symbol}, CompanyName: {CompanyName}",
                    dto.Symbol,
                    dto.CompanyName);

                var createdStock = await _stockService.CreateStockAsync(dto, GetCurrentUserId());
                if (!createdStock.IsSuccess || createdStock.Data == null)
                {
                    return BadRequest("Invalid stock.");
                }

                _logger.LogInformation(
                    "StocksController.CreateStock completed successfully. StockId: {StockId}",
                    createdStock.Data.Id);

                return CreatedAtAction(nameof(GetStock), new { id = createdStock.Data.Id }, createdStock.Data);
            }
            catch (Exception ex)
            {
                    _logger.LogError(ex,
                    "Error occurred while creating stock. Symbol: {Symbol}, CompanyName: {CompanyName}",
                    dto.Symbol,
                    dto.CompanyName);

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // Adds the stock to the user's list, or updates its planned price/quantity
        [HttpPut("{symbol}")]
        public async Task<IActionResult> SaveStock(string symbol, [FromBody] SaveStockDto dto)
        {
            try
            {
                var result = await _stockService.SaveStockAsync(symbol, dto, GetCurrentUserId());
                if (!result.IsSuccess)
                {
                    return BadRequest("Invalid stock.");
                }
                return Ok(result.Data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving stock. Symbol: {Symbol}", symbol);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // :int keeps this apart from DELETE {symbol} below; without it every DELETE is ambiguous (500)
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            try
            {
                _logger.LogInformation("StocksController.DeleteStock started. StockId: {StockId}", id);
                var deleted = await _stockService.DeleteStockAsync(id, GetCurrentUserId());
                if (!deleted.IsSuccess)
                {
                    _logger.LogWarning("StocksController.DeleteStock failed. Stock not found. StockId: {StockId}", id);
                    return NotFound();
                }
                _logger.LogInformation("StocksController.DeleteStock completed successfully. StockId: {StockId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error occurred while deleting stock. StockId: {StockId}", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{symbol}")]
        public async Task<IActionResult> DeleteStockBySymbol(string symbol)
        {
            try
            {
                var deleted = await _stockService.DeleteStockBySymbolAsync(symbol, GetCurrentUserId());
                if (!deleted.IsSuccess)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error occurred while deleting stock. Symbol: {Symbol}", symbol);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
