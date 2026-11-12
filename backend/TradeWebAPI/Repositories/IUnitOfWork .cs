using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories
{
    public interface IUnitOfWork: IDisposable
    {
        public IUserRepository Users { get; }
        public ITradeRepository Trades { get; }
        public IStockRepository Stocks { get; }
        public IUserStockRepository UserStocks { get; }
        public ISupportRequestRepository SupportRequests { get; }
        public Task<int> CompleteAsync();

    }
}
