using Microsoft.AspNetCore.Mvc;
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
