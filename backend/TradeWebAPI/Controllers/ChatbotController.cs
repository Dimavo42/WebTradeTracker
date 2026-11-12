using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeWebAPI.Enums;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Controllers
{
    // Support queue — any logged-in user:
    //   POST   /api/chatbot                    call support (join the queue)
    //   GET    /api/chatbot/me                 my waiting request
    //   GET    /api/chatbot                    everyone waiting
    //   DELETE /api/chatbot/{conversationId}   close (removes it from the queue)
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatbotController : BaseController
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(ILogger<ChatbotController> logger, IChatbotService chatbotService) : base(logger)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost]
        public async Task<IActionResult> CallSupport()
        {
            var result = await _chatbotService.CallSupportAsync(GetCurrentUserId());

            // 200 = already waiting, 201 = just joined
            return result.Status == AppStatus.AlreadyExists
                ? Ok(result.Data)
                : StatusCode(StatusCodes.Status201Created, result.Data);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyRequest()
        {
            var result = await _chatbotService.GetMyRequestAsync(GetCurrentUserId());
            return result.IsSuccess ? Ok(result.Data) : NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> GetWaiting()
        {
            var result = await _chatbotService.GetWaitingAsync();
            return Ok(result.Data);
        }

        [HttpDelete("{conversationId:guid}")]
        public async Task<IActionResult> Close(Guid conversationId)
        {
            var result = await _chatbotService.CloseAsync(conversationId);
            return result.IsSuccess ? NoContent() : NotFound();
        }
    }
}
