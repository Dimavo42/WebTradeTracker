using AutoMapper;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Mappings
{
    public class SupportRequestProfile : Profile
    {
        public SupportRequestProfile()
        {
            CreateMap<SupportRequest, SupportRequestDto>()
                .ForMember(d => d.UserEmail, o => o.MapFrom(s => s.User.Email));
        }
    }
}
