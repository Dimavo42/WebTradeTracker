using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public ITradeRepository Trades { get; }
        public IStockRepository Stocks { get; }

        public IUserRepository Users { get; }

        public UnitOfWork(
            AppDbContext context,
            ITradeRepository tradeRepository,
            IStockRepository stockRepository,
            IUserRepository users)
        {
            _context = context;
            Trades = tradeRepository;
            Stocks = stockRepository;
            Users = users;
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
