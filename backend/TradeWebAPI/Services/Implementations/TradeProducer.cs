using Confluent.Kafka;
using System.Text.Json;
using TradeWebAPI.Entities;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class TradeProducer: ITradeProducer
    {
        private readonly IProducer<string, string> _producer;

        public TradeProducer(IProducer<string, string> producer)
        {
            _producer = producer;
        }

        public async Task<DeliveryResult<string, string>> PublishTrade(Trade trade)
        {
            return await _producer.ProduceAsync(
                "trades.created",
                new Message<string, string>
                {
                    Key = trade.Id.ToString(),
                    Value = JsonSerializer.Serialize(trade)
                }
                );

           
        }
    }
}
