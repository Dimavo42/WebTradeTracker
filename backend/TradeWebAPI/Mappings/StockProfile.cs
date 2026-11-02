using AutoMapper;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Mappings
{
    public class StockProfile : Profile
    {
        public StockProfile()
        {
            // Id/Symbol/CompanyName/... come from the shared Stock, price/quantity from the user's entry
            CreateMap<UserStock, StockDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Stock.Id))
                .ForMember(dest => dest.Symbol, opt => opt.MapFrom(src => src.Stock.Symbol))
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Stock.CompanyName))
                .ForMember(dest => dest.Exchange, opt => opt.MapFrom(src => src.Stock.Exchange))
                .ForMember(dest => dest.Sector, opt => opt.MapFrom(src => src.Stock.Sector));
        }
    }
}
