using System.Diagnostics;

namespace TradeWebAPI.Middleware
{
    //Can add A JWT Checking Middleware here in the future if needed
    //Logging Middleware to log incoming requests and outgoing responses with execution time
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopWatch = Stopwatch.StartNew();
            var method = context.Request.Method;
            var path = context.Request.Path;
            _logger.LogInformation("Incoming request: {Method} {Path}", 
                method, 
                path);
            await _next(context);
            stopWatch.Stop();
            var statusCode = context.Response.StatusCode;
            _logger.LogInformation("Completed request: {Method} {Path} responded with {StatusCode} in {ElapsedMilliseconds}ms",
                method,
                path,
                statusCode,
                stopWatch.ElapsedMilliseconds);

        }
    }
}
