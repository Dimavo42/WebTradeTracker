using TradeWebAPI.Entities;

namespace TradeWebAPI.Services.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}
