using Microsoft.AspNetCore.Mvc;
using TradeWebAPI.DTOs;
using TradeWebAPI.Enums;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TradeController : BaseController
    {

        private readonly ITradeService _tradeService;

        private readonly ILogger<TradeController> _logger;
        public TradeController(ILogger<TradeController> logger, ITradeService tradeService) : base(logger)
        {
            _tradeService = tradeService;
            _logger = logger;
        }


        [HttpGet]
        public async Task<IActionResult> GetTrades()
        {
            try
            {
                _logger.LogInformation("GetTrades started.");
                var trades = await _tradeService.GetTradesAsync();
                return Ok(trades);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching trades.");
                return StatusCode(500, "An error occurred while processing your request.");

            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrade(int id)
        {
            try
            {
                _logger.LogInformation("GetTrade started. TradeId: {TradeId}", id);

                var trade = await _tradeService.GetTradeByIdAsync(id);

                if (trade == null)
                {
                    _logger.LogWarning("GetTrade failed. Trade not found. TradeId: {TradeId}", id);
                    return NotFound();
                }

                _logger.LogInformation("GetTrade completed successfully. TradeId: {TradeId}", id);
                return Ok(trade);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting trade. TradeId: {TradeId}", id);
                return StatusCode(500, "An error occurred while getting the trade.");
            }

        }

        [HttpPost]
        public async Task<IActionResult> CreateTrade([FromBody] CreateTradeDto dto)
        {
            try
            {
                _logger.LogInformation(
                    "TradeController.CreateTrade started. StockId: {StockId}, TradeType: {TradeType}, Quantity: {Quantity}",
                    dto?.StockId,
                    dto?.TradeType,
                    dto?.Quantity);

                var result = await _tradeService.CreateTradeAsync(dto);

                if (!result.IsSuccess)
                {
                    _logger.LogWarning(
                        "TradeController.CreateTrade failed. Status: {Status}, StockId: {StockId}, TradeType: {TradeType}",
                        result.Status,
                        dto?.StockId,
                        dto?.TradeType);

                    return result.Status switch
                    {
                        AppStatus.InvalidRequest => BadRequest("Invalid request."),
                        AppStatus.InvalidQuantity => BadRequest("Quantity must be greater than 0."),
                        AppStatus.InvalidPrice => BadRequest("Price must be greater than 0."),
                        AppStatus.InvalidTradeDate => BadRequest("Trade date cannot be in the future."),
                        AppStatus.StockNotFound => BadRequest("Stock not found."),
                        _ => StatusCode(500, "An unexpected error occurred.")
                    };
                }

                var createdTrade = result.Data!;

                _logger.LogInformation(
                    "TradeController.CreateTrade completed successfully. TradeId: {TradeId}",
                    createdTrade.Id);

                return CreatedAtAction(nameof(GetTrade), new { id = createdTrade.Id }, createdTrade);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error while creating trade. StockId: {StockId}, TradeType: {TradeType}",
                    dto?.StockId,
                    dto?.TradeType);

                return StatusCode(500, "An error occurred while creating the trade.");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTrade(int id)
        {
            try
            {
                _logger.LogInformation("DeleteTrade started. TradeId: {TradeId}", id);

                var deleted = await _tradeService.DeleteTradeAsync(id);

                if (!deleted)
                {
                    _logger.LogWarning("DeleteTrade failed. Trade not found. TradeId: {TradeId}", id);
                    return NotFound();
                }


                _logger.LogInformation("DeleteTrade completed successfully. TradeId: {TradeId}", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting trade. TradeId: {TradeId}", id);
                return StatusCode(500, "An error occurred while deleting the trade.");
            }

        }
    }
}
