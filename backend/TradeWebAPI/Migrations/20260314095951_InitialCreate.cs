using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TradeWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Symbol = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Exchange = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Sector = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "User")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Trades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockId = table.Column<int>(type: "int", nullable: false),
                    TradeType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EntryPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ExitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EntryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExitDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Trades_Stocks_StockId",
                        column: x => x.StockId,
                        principalTable: "Stocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "Symbol", "CompanyName", "Exchange", "Sector", "CreatedAt" },
                values: new object[,]
                {
                    { 1, "AAPL", "Apple Inc.", "NASDAQ", "Technology", new DateTime(2026, 3, 12, 12, 0, 0, DateTimeKind.Utc) },
                    { 2, "MSFT", "Microsoft Corporation", "NASDAQ", "Technology", new DateTime(2026, 3, 12, 12, 5, 0, DateTimeKind.Utc) },
                    { 3, "TSLA", "Tesla Inc.", "NASDAQ", "Automotive", new DateTime(2026, 3, 12, 12, 10, 0, DateTimeKind.Utc) },
                    { 4, "AMZN", "Amazon.com Inc.", "NASDAQ", "E-Commerce", new DateTime(2026, 3, 12, 12, 15, 0, DateTimeKind.Utc) },
                    { 5, "NVDA", "NVIDIA Corporation", "NASDAQ", "Semiconductors", new DateTime(2026, 3, 12, 12, 20, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Username", "Email", "PasswordHash", "Role" },
                values: new object[,]
                {
                    //Admin123!
                    //user123
                    { 1, "admin", "admin@test.com", "$2b$10$tQv.ENeqjisPOg.iuSVglOkXvnOuhVf5oBgkxWlpyGlyRwrY19AyG", "Admin" },
                    { 2, "user", "user@test.com", "$2b$10$1D/iavoSGh4BCTEDg4/KuOEEvK6fzM3jPraFDnJI7j2Bdf1YuDpKq", "User" }
                });

            migrationBuilder.InsertData(
                table: "Trades",
                columns: new[]
                {
                    "Id", "StockId", "TradeType", "Quantity", "EntryPrice",
                    "ExitPrice", "EntryDate", "ExitDate", "Fees", "Status", "Notes", "CreatedAt"
                },
                values: new object[,]
                {
                    {
                        1, 1, "Buy", 10m, 185.50m,
                        null, new DateTime(2026, 3, 10, 14, 30, 0, DateTimeKind.Utc), null,
                        2.50m, "Open", "Seeded demo trade for Apple", new DateTime(2026, 3, 12, 12, 30, 0, DateTimeKind.Utc)
                    },
                    {
                        2, 2, "Buy", 5m, 410.00m,
                        425.75m, new DateTime(2026, 3, 8, 10, 0, 0, DateTimeKind.Utc), new DateTime(2026, 3, 11, 15, 0, 0, DateTimeKind.Utc),
                        1.80m, "Closed", "Seeded demo trade for Microsoft", new DateTime(2026, 3, 12, 12, 35, 0, DateTimeKind.Utc)
                    },
                    {
                        3, 3, "Sell", 8m, 240.25m,
                        null, new DateTime(2026, 3, 9, 9, 15, 0, DateTimeKind.Utc), null,
                        2.10m, "Open", "Seeded short trade for Tesla", new DateTime(2026, 3, 12, 12, 40, 0, DateTimeKind.Utc)
                    },
                    {
                        4, 4, "Buy", 12m, 172.90m,
                        180.10m, new DateTime(2026, 3, 5, 13, 45, 0, DateTimeKind.Utc), new DateTime(2026, 3, 7, 16, 20, 0, DateTimeKind.Utc),
                        3.00m, "Closed", "Seeded trade for Amazon", new DateTime(2026, 3, 12, 12, 45, 0, DateTimeKind.Utc)
                    },
                    {
                        5, 5, "Buy", 20m, 890.00m,
                        null, new DateTime(2026, 3, 11, 11, 10, 0, DateTimeKind.Utc), null,
                        4.25m, "Open", "Seeded trade for NVIDIA", new DateTime(2026, 3, 12, 12, 50, 0, DateTimeKind.Utc)
                    }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_Symbol",
                table: "Stocks",
                column: "Symbol",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trades_StockId",
                table: "Trades",
                column: "StockId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trades");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Stocks");
        }
    }
}
