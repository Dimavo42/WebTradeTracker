using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories;
using TradeWebAPI.Repositories.Interfaces;
using TradeWebAPI.Services.Implementations;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Tests.Services
{
    public class TradeServiceTests
    {
        private const int UserA = 7;
        private const int UserB = 8;

        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ITradeRepository> _tradeRepositoryMock;
        private readonly Mock<IStockRepository> _stockRepositoryMock;
        private readonly Mock<ILogger<TradeService>> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ITradeValidator> _tradeValidatorMock;
        private readonly Mock<ITradeProducer> _tradeProducerMock;

        private readonly TradeService _tradeService;

        public TradeServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _tradeRepositoryMock = new Mock<ITradeRepository>();
            _stockRepositoryMock = new Mock<IStockRepository>();
            _loggerMock = new Mock<ILogger<TradeService>>();
            _mapperMock = new Mock<IMapper>();
            _tradeValidatorMock = new Mock<ITradeValidator>();
            _tradeProducerMock = new Mock<ITradeProducer>();

            _unitOfWorkMock.Setup(u => u.Trades).Returns(_tradeRepositoryMock.Object);
            _unitOfWorkMock.Setup(u => u.Stocks).Returns(_stockRepositoryMock.Object);

            _tradeService = new TradeService(
                _unitOfWorkMock.Object,
                _loggerMock.Object,
                _mapperMock.Object,
                _tradeValidatorMock.Object,
                _tradeProducerMock.Object);
        }

        private static CreateTradeDto ValidBuyDto() => new()
        {
            StockSymbol = "aapl",
            TradeType = "Buy",
            Status = "Open",
            Quantity = 2,
            Price = 100,
            Fees = 1,
            TradeDate = new DateTime(2026, 1, 1)
        };

        [Fact]
        public async Task CreateTradeAsync_ShouldReturnValidatorStatus_WhenValidationFails()
        {
            var dto = ValidBuyDto();
            _tradeValidatorMock
                .Setup(v => v.ValidateCreateTradeAsync(dto))
                .ReturnsAsync(AppStatus.InvalidTradeDate);

                        var result = await _tradeService.CreateTradeAsync(dto, UserA);

            result.IsSuccess.Should().BeFalse();
            result.Status.Should().Be(AppStatus.InvalidTradeDate);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Never);
            _tradeProducerMock.Verify(p => p.PublishTrade(It.IsAny<Trade>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task CreateTradeAsync_ShouldOwnTradeByCallingUser_WhenValid()
        {
            var dto = ValidBuyDto();
            var stock = new Stock { Id = 1, Symbol = "AAPL", CompanyName = "Apple" };
            Trade? added = null;

            _tradeValidatorMock.Setup(v => v.ValidateCreateTradeAsync(dto)).ReturnsAsync(AppStatus.Success);
            _stockRepositoryMock.Setup(s => s.GetBySymbolAsync("AAPL")).ReturnsAsync(stock);
            _tradeRepositoryMock
                .Setup(t => t.AddAsync(It.IsAny<Trade>()))
                .Callback<Trade>(t => added = t)
                .Returns(Task.CompletedTask);

                        var result = await _tradeService.CreateTradeAsync(dto, UserA);

            result.IsSuccess.Should().BeTrue();
            added.Should().NotBeNull();
            added!.UserId.Should().Be(UserA);
            added.Stock.Should().BeSameAs(stock);
            added.EntryPrice.Should().Be(100);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Once);
            _tradeProducerMock.Verify(p => p.PublishTrade(added, It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task CreateTradeAsync_ShouldReturnInvalidRequest_WhenTradeTypeIsUnknown()
        {
            var dto = ValidBuyDto();
            dto.TradeType = "Hold";
            _tradeValidatorMock.Setup(v => v.ValidateCreateTradeAsync(dto)).ReturnsAsync(AppStatus.Success);
            _stockRepositoryMock.Setup(s => s.GetBySymbolAsync("AAPL")).ReturnsAsync(new Stock { Symbol = "AAPL" });

                        var result = await _tradeService.CreateTradeAsync(dto, UserA);

            result.Status.Should().Be(AppStatus.InvalidRequest);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Never);
        }

        [Fact]
        public async Task GetTradesAsync_ShouldOnlyQueryTheCallingUsersTrades()
        {
            var trades = new List<Trade> { new() { Id = 1, UserId = UserA }, new() { Id = 2, UserId = UserA } };
            var tradeDtos = new List<TradeDto> { new() { Id = 1 }, new() { Id = 2 } };

            _tradeRepositoryMock.Setup(t => t.GetAllTradesByUserIdAsync(UserA)).ReturnsAsync(trades);
            _mapperMock.Setup(m => m.Map<List<TradeDto>>(trades)).Returns(tradeDtos);

                        var result = await _tradeService.GetTradesAsync(UserA);

            result.IsSuccess.Should().BeTrue();
            result.Data.Should().BeEquivalentTo(tradeDtos);
            _tradeRepositoryMock.Verify(t => t.GetAllTradesByUserIdAsync(UserA), Times.Once);
            _tradeRepositoryMock.Verify(t => t.GetAllTradesByUserIdAsync(It.Is<int>(id => id != UserA)), Times.Never);
        }

        [Fact]
        public async Task GetTradeByIdAsync_ShouldReturnNotFound_WhenTradeBelongsToAnotherUser()
        {
            // The repository filters by owner, so user B looking up user A's trade gets nothing
            _tradeRepositoryMock.Setup(t => t.GetByIdAsync(5, UserB)).ReturnsAsync((Trade?)null);

                        var result = await _tradeService.GetTradeByIdAsync(5, UserB);

            result.IsSuccess.Should().BeFalse();
            result.Status.Should().Be(AppStatus.NotFound);
            _mapperMock.Verify(m => m.Map<TradeDto>(It.IsAny<Trade>()), Times.Never);
        }

        [Fact]
        public async Task GetTradeByIdAsync_ShouldReturnMappedDto_WhenTradeBelongsToUser()
        {
            var trade = new Trade { Id = 5, UserId = UserA };
            var tradeDto = new TradeDto { Id = 5 };
            _tradeRepositoryMock.Setup(t => t.GetByIdAsync(5, UserA)).ReturnsAsync(trade);
            _mapperMock.Setup(m => m.Map<TradeDto>(trade)).Returns(tradeDto);

                        var result = await _tradeService.GetTradeByIdAsync(5, UserA);

            result.IsSuccess.Should().BeTrue();
            result.Data.Should().Be(tradeDto);
        }

        [Fact]
        public async Task UpdateTradeAsync_ShouldReturnNotFound_AndNotSave_WhenTradeBelongsToAnotherUser()
        {
            _tradeRepositoryMock.Setup(t => t.GetByIdAsync(5, UserB)).ReturnsAsync((Trade?)null);

                        var result = await _tradeService.UpdateTradeAsync(5, new UpdateTradeDto(), UserB);

            result.Status.Should().Be(AppStatus.NotFound);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteTradeAsync_ShouldOnlyDeleteTheCallingUsersTrades()
        {
            _tradeRepositoryMock.Setup(t => t.DeleteTradesByStockSymbolAsync("AAPL", UserA)).ReturnsAsync(true);

                        var result = await _tradeService.DeleteTradeAsync(" aapl ", UserA);

            result.IsSuccess.Should().BeTrue();
            _tradeRepositoryMock.Verify(t => t.DeleteTradesByStockSymbolAsync("AAPL", UserA), Times.Once);
            _tradeRepositoryMock.Verify(
                t => t.DeleteTradesByStockSymbolAsync(It.IsAny<string>(), It.Is<int>(id => id != UserA)),
                Times.Never);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteTradeAsync_ShouldFail_AndNotSave_WhenUserHasNoTradesForSymbol()
        {
            _tradeRepositoryMock.Setup(t => t.DeleteTradesByStockSymbolAsync("AAPL", UserB)).ReturnsAsync(false);

                        var result = await _tradeService.DeleteTradeAsync("AAPL", UserB);

            result.IsSuccess.Should().BeFalse();
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Never);
        }
    }
}
