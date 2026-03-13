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
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Symbol = table.Column<string>(maxLength: 20, nullable: false),
                    CompanyName = table.Column<string>(maxLength: 200, nullable: false),
                    Exchange = table.Column<string>(maxLength: 100, nullable: true),
                    Sector = table.Column<string>(maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Trades",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockId = table.Column<int>(nullable: false),
                    TradeType = table.Column<string>(maxLength: 20, nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    EntryPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ExitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EntryDate = table.Column<DateTime>(nullable: false),
                    ExitDate = table.Column<DateTime>(nullable: true),
                    Status = table.Column<string>(maxLength: 20, nullable: false),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Notes = table.Column<string>(maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false)
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
                table: "Trades",
                columns: new[]
                {
                    "Id", "StockId", "TradeType", "Quantity", "EntryPrice",
                    "ExitPrice", "EntryDate", "ExitDate", "Status", "Fees", "Notes", "CreatedAt"
                },
                values: new object[,]
                {
                    {
                        1, 1, "Buy", 10, 185.50m,
                        null, new DateTime(2026, 3, 10, 14, 30, 0, DateTimeKind.Utc), null,
                        "Open", 2.50m, "Seeded demo trade for Apple", new DateTime(2026, 3, 12, 12, 30, 0, DateTimeKind.Utc)
                    },
                    {
                        2, 2, "Buy", 5, 410.00m,
                        425.75m, new DateTime(2026, 3, 8, 10, 0, 0, DateTimeKind.Utc), new DateTime(2026, 3, 11, 15, 0, 0, DateTimeKind.Utc),
                        "Closed", 1.80m, "Seeded demo trade for Microsoft", new DateTime(2026, 3, 12, 12, 35, 0, DateTimeKind.Utc)
                    },
                    {
                        3, 3, "Sell", 8, 240.25m,
                        null, new DateTime(2026, 3, 9, 9, 15, 0, DateTimeKind.Utc), null,
                        "Open", 2.10m, "Seeded short trade for Tesla", new DateTime(2026, 3, 12, 12, 40, 0, DateTimeKind.Utc)
                    },
                    {
                        4, 4, "Buy", 12, 172.90m,
                        180.10m, new DateTime(2026, 3, 5, 13, 45, 0, DateTimeKind.Utc), new DateTime(2026, 3, 7, 16, 20, 0, DateTimeKind.Utc),
                        "Closed", 3.00m, "Seeded trade for Amazon", new DateTime(2026, 3, 12, 12, 45, 0, DateTimeKind.Utc)
                    },
                    {
                        5, 5, "Buy", 20, 890.00m,
                        null, new DateTime(2026, 3, 11, 11, 10, 0, DateTimeKind.Utc), null,
                        "Open", 4.25m, "Seeded trade for NVIDIA", new DateTime(2026, 3, 12, 12, 50, 0, DateTimeKind.Utc)
                    }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trades_StockId",
                table: "Trades",
                column: "StockId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trades");

            migrationBuilder.DropTable(
                name: "Stocks");
        }
    }
}