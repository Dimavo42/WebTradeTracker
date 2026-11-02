using TradeWebAPI.Repositories.Interfaces;

namespace TradeWebAPI.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public ITradeRepository Trades { get; }
        public IStockRepository Stocks { get; }

        public IUserRepository Users { get; }

        public IUserStockRepository UserStocks { get; }

        public UnitOfWork(
            AppDbContext context,
            ITradeRepository tradeRepository,
            IStockRepository stockRepository,
            IUserRepository users,
            IUserStockRepository userStocks)
        {
            _context = context;
            Trades = tradeRepository;
            Stocks = stockRepository;
            Users = users;
            UserStocks = userStocks;
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
