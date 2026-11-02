using Confluent.Kafka;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Services.Interfaces
{
    public interface ITradeProducer
    {
        Task<DeliveryResult<string, string>> PublishTrade(Trade trade,string action);
    }
}
