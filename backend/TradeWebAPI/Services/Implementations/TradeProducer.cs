using AutoMapper;
using Confluent.Kafka;
using System.Text.Json;
using TradeWebAPI.Entities;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class TradeProducer : ITradeProducer
    {
        private readonly IProducer<string, string> _producer;
        private readonly IMapper _mapper;

        private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };


        public TradeProducer(IProducer<string, string> producer, IMapper mapper)
        {
            _producer = producer;
            _mapper = mapper;
        }

        public async Task<DeliveryResult<string, string>> PublishTrade(Trade trade, string action)
        {
            // Shape must match AuditRecord in audit/src/audit/audit.service.ts
            var auditEvent = new
            {
                eventId = Guid.NewGuid().ToString(),
                action = action,
                entityId = trade.Id.ToString(),
                entityType = nameof(Trade),
                timestamp = DateTime.UtcNow,
                details = JsonSerializer.Serialize(_mapper.Map<TradeEvent>(trade), JsonOptions)
            };

            return await _producer.ProduceAsync(
                "trades",
                new Message<string, string>
                {
                    Key = trade.Id.ToString(),
                    Value = JsonSerializer.Serialize(auditEvent, JsonOptions)
                });
        }

    }
}

 

