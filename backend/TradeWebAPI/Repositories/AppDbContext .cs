using Microsoft.EntityFrameworkCore;
using TradeWebAPI.Entities;

namespace TradeWebAPI.Repositories
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Stock> Stocks { get; set; }

        public  DbSet<Trade> Trades { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Stock>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Symbol)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(x => x.CompanyName)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(x => x.Exchange)
                    .HasMaxLength(100);

                entity.Property(x => x.Sector)
                    .HasMaxLength(100);

                entity.Property(x => x.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasIndex(x => x.Symbol)
                    .IsUnique();
            });
            modelBuilder.Entity<Trade>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.TradeType)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(x => x.Status)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(x => x.Notes)
                    .HasMaxLength(1000);

                entity.Property(x => x.EntryPrice)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.ExitPrice)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.Fees)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(x => x.Stock)
                    .WithMany(x => x.Trades)
                    .HasForeignKey(x => x.StockId)
                    .OnDelete(DeleteBehavior.Cascade);

            });
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(x => x.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(x => x.Role)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("User");

                entity.HasIndex(x => x.Email)
                    .IsUnique();
            });
        }
    }
    
}
