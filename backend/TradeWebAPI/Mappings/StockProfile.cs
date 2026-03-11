using AutoMapper;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Mappings
{
    public class StockProfile : Profile
    {
        public StockProfile()
        {
            CreateMap<Stock, StockDto>();
            CreateMap<CreateStockDto, Stock>();
        }
    }
}
