using AutoMapper;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Mappings
{
    public class TradeProfile : Profile
    {
        public TradeProfile()
        {
            CreateMap<CreateTradeDto, Trade>();


            CreateMap<Trade, TradeDto>()
            .ForMember(dest => dest.Symbol,
        opt => opt.MapFrom(src => src.Stock.Symbol));

        }
    }
}
