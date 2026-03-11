using Microsoft.EntityFrameworkCore;
using TradeWebAPI.Mappings;
using TradeWebAPI.Middleware;
using TradeWebAPI.Repositories;
using TradeWebAPI.Repositories.Implementations;
using TradeWebAPI.Repositories.Interfaces;
using TradeWebAPI.Services.Implementations;
using TradeWebAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAutoMapper(typeof(TradeProfile));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Sql")));
// Add services to the container
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ITradeService, TradeService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<ITradeValidator, TradeValidator>();
builder.Services.AddScoped<ITradeRepository, TradeRepository>();
builder.Services.AddScoped<IStockRepository, StockRepository>();
var app = builder.Build();

app.UseMiddleware<RequestLoggingMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

 app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
