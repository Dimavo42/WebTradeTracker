using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeWebAPI.DTOs;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Controllers
{
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

                var stocks = await _stockService.GetStocksAsync();

                _logger.LogInformation("StocksController.GetStocks completed successfully.");

                return Ok(stocks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching stocks.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStock(int id)
        {
            _logger.LogInformation("GetStock called. StockId: {StockId}", id);
            try
            {
                var stock = await _stockService.GetStockByIdAsync(id);
                if (stock == null)
                {
                    _logger.LogWarning("GetStock failed. Stock not found. StockId: {StockId}", id);
                    return NotFound();
                }
                return Ok(stock);
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

                var createdStock = await _stockService.CreateStockAsync(dto);

                _logger.LogInformation(
                    "StocksController.CreateStock completed successfully. StockId: {StockId}",
                    createdStock.Id);

                return CreatedAtAction(nameof(GetStock), new { id = createdStock.Id }, createdStock);
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            try
            {
                _logger.LogInformation("StocksController.DeleteStock started. StockId: {StockId}", id);
                var deleted = await _stockService.DeleteStockAsync(id);
                if (!deleted)
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
    }
}
