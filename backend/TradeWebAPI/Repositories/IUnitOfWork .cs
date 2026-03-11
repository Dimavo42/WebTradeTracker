using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories
{
    public interface IUnitOfWork: IDisposable
    {
        public ITradeRepository Trades { get; }
        public IStockRepository Stocks { get; }
        public Task<int> CompleteAsync();

    }
}
