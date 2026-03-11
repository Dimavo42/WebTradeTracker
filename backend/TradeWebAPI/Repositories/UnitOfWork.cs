using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public ITradeRepository Trades { get; }
        public IStockRepository Stocks { get; }

        public UnitOfWork(
            AppDbContext context,
            ITradeRepository tradeRepository,
            IStockRepository stockRepository)
        {
            _context = context;
            Trades = tradeRepository;
            Stocks = stockRepository;
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
