using TradeWebAPI.Common;
using TradeWebAPI.DTOs;

namespace TradeWebAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterRequestDto request);
        Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginRequestDto request);
    }
}
