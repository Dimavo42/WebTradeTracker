using AutoMapper;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Mappings
{
   public class TradeEventProfile : Profile
   {
       public TradeEventProfile()
       {
           CreateMap<Trade,TradeEvent>();
       }
   }
}