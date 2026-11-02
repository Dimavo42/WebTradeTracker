using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;

namespace TradeWebAPI.Controllers
{
    public abstract class BaseController:ControllerBase
    {
        protected readonly ILogger Logger;

        protected HttpRequestParamters? RequestParamters { get; private set; }


        protected BaseController(ILogger logger)
        {
            Logger = logger;
        }

        // Reads the user id from the current request's JWT (set by JwtTokenService).
        // Nothing is stored on the controller. Only valid on [Authorize] actions.
        protected int GetCurrentUserId()
        {
            // The NameIdentifier claim IS the user id, as set by JwtTokenService.
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new InvalidOperationException("Authenticated user has no NameIdentifier claim.");

            return int.Parse(value);
        }


        protected AppStatus PreProcess()
        {
            var userAgent = Request.Headers.UserAgent.ToString();
            var remoteIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty;
            RequestParamters = new HttpRequestParamters
            {
                UserAgent = userAgent ?? string.Empty,
                Ip = remoteIp,
                RequestTime = DateTime.UtcNow
            };

            Logger.LogInformation("Processing request from {Ip}", RequestParamters.Ip);
            return AppStatus.Success;
        }
    }
}
