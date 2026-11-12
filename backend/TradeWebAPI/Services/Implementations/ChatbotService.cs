using AutoMapper;
using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class ChatbotService : IChatbotService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ChatbotService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ServiceResult<SupportRequestDto>> CallSupportAsync(int userId)
        {
            var existing = await _unitOfWork.SupportRequests.GetByUserIdAsync(userId);
            if (existing != null)
            {
                // Already waiting: return the same conversation instead of a duplicate
                return new ServiceResult<SupportRequestDto>
                {
                    IsSuccess = true,
                    Status = AppStatus.AlreadyExists,
                    Data = _mapper.Map<SupportRequestDto>(existing)
                };
            }

            var request = new SupportRequest { UserId = userId };
            await _unitOfWork.SupportRequests.AddAsync(request);
            await _unitOfWork.CompleteAsync();

            // Reload so the user's email is filled in
            var created = await _unitOfWork.SupportRequests.GetByUserIdAsync(userId);
            return ServiceResult<SupportRequestDto>.Success(_mapper.Map<SupportRequestDto>(created));
        }

        public async Task<ServiceResult<SupportRequestDto>> GetMyRequestAsync(int userId)
        {
            var request = await _unitOfWork.SupportRequests.GetByUserIdAsync(userId);
            return request == null
                ? ServiceResult<SupportRequestDto>.Failure(AppStatus.NotFound)
                : ServiceResult<SupportRequestDto>.Success(_mapper.Map<SupportRequestDto>(request));
        }

        public async Task<ServiceResult<IEnumerable<SupportRequestDto>>> GetWaitingAsync()
        {
            var waiting = await _unitOfWork.SupportRequests.GetAllAsync();
            return ServiceResult<IEnumerable<SupportRequestDto>>.Success(
                _mapper.Map<List<SupportRequestDto>>(waiting));
        }

        public async Task<ServiceResult<bool>> CloseAsync(Guid conversationId)
        {
            var request = await _unitOfWork.SupportRequests.GetByConversationIdAsync(conversationId);
            if (request == null)
                return ServiceResult<bool>.Failure(AppStatus.NotFound);

            _unitOfWork.SupportRequests.Remove(request);
            await _unitOfWork.CompleteAsync();
            return ServiceResult<bool>.Success(true);
        }
    }
}
