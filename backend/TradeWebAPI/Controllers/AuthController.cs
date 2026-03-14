using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeWebAPI.DTOs;
using TradeWebAPI.Enums;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            _logger.LogInformation("Register endpoint called for email: {Email}", request.Email);

            var result = await _authService.RegisterAsync(request);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Register failed with status: {Status}", result.Status);
                return MapFailure(result.Status);
            }

            _logger.LogInformation("Register succeeded for email: {Email}", request.Email);
            return Ok(result.Data);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            _logger.LogInformation("Login endpoint called for email: {Email}", request.Email);

            var result = await _authService.LoginAsync(request);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Login failed with status: {Status}", result.Status);
                return MapFailure(result.Status);
            }

            _logger.LogInformation("Login succeeded for email: {Email}", request.Email);
            return Ok(result.Data);
        }

        private IActionResult MapFailure(AppStatus status)
        {
            return status switch
            {
                AppStatus.InvalidRequest => BadRequest(new { message = "Invalid request." }),
                AppStatus.NotFound => NotFound(new { message = "User not found." }),
                AppStatus.AlreadyExists => Conflict(new { message = "User already exists." }),
                AppStatus.Unauthorized => Unauthorized(new { message = "Invalid email or password." }),
                _ => StatusCode(500, new { message = "An unexpected error occurred." })
            };
        }
    }
}
