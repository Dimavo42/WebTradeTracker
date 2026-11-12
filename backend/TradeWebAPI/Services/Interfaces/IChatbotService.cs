using TradeWebAPI.Common;
using TradeWebAPI.DTOs;

namespace TradeWebAPI.Services.Interfaces
{
    // Simple support queue: a user calls support (joins), anyone can see the queue and close a request.
    public interface IChatbotService
    {
        // Join the queue. If the user is already waiting, returns that entry with Status = AlreadyExists.
        Task<ServiceResult<SupportRequestDto>> CallSupportAsync(int userId);

        Task<ServiceResult<SupportRequestDto>> GetMyRequestAsync(int userId);

        Task<ServiceResult<IEnumerable<SupportRequestDto>>> GetWaitingAsync();

        Task<ServiceResult<bool>> CloseAsync(Guid conversationId);
    }
}
