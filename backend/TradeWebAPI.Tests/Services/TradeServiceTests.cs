using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories;
using TradeWebAPI.Services.Implementations;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Tests.Services
{
    public class TradeServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ILogger<TradeService>> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ITradeValidator> _tradeValidatorMock;

        private readonly TradeService _tradeService;

        public TradeServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _loggerMock = new Mock<ILogger<TradeService>>();
            _mapperMock = new Mock<IMapper>();
            _tradeValidatorMock = new Mock<ITradeValidator>();

            _tradeService = new TradeService(
                _unitOfWorkMock.Object,
                _loggerMock.Object,
                _mapperMock.Object,
                _tradeValidatorMock.Object);
        }

        [Fact]
        public async Task CreateTradeAsync_ShouldReturnFailure_WhenValidationFails()
        {
            // Arrange
            var createTradeDto = new CreateTradeDto();

            _tradeValidatorMock
                .Setup(v => v.ValidateCreateTradeAsync(createTradeDto))
                .ReturnsAsync(AppStatus.InvalidRequest);

            // Act
            var result = await _tradeService.CreateTradeAsync(createTradeDto);

            // Assert
            result.Should().NotBeNull();
            result.IsSuccess.Should().BeFalse();
            result.Status.Should().Be(AppStatus.InvalidRequest);

            _mapperMock.Verify(m => m.Map<Trade>(It.IsAny<CreateTradeDto>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Never);
        }

        [Fact]
        public async Task CreateTradeAsync_ShouldAddTradeAndReturnSuccess_WhenValidationSucceeds()
        {
            // Arrange
            var createTradeDto = new CreateTradeDto
            {
                // fill properties if needed
            };

            var trade = new Trade
            {
                EntryDate = default,
                CreatedAt = default,
                Status = null
            };

            var tradeDto = new TradeDto
            {
                Id = 1
            };

            _tradeValidatorMock
                .Setup(v => v.ValidateCreateTradeAsync(createTradeDto))
                .ReturnsAsync(AppStatus.Success);

            _mapperMock
                .Setup(m => m.Map<Trade>(createTradeDto))
                .Returns(trade);

            _mapperMock
                .Setup(m => m.Map<TradeDto>(trade))
                .Returns(tradeDto);

            _unitOfWorkMock
                .Setup(u => u.Trades.AddAsync(trade))
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.CompleteAsync())
                .ReturnsAsync(1);

            // Act
            var result = await _tradeService.CreateTradeAsync(createTradeDto);

            // Assert
            result.Should().NotBeNull();
            result.IsSuccess.Should().BeTrue();
            result.Data.Should().Be(tradeDto);
            result.Status.Should().Be(AppStatus.Success);

            trade.EntryDate.Should().NotBe(default);
            trade.CreatedAt.Should().NotBe(default);
            trade.Status.Should().Be("Open");

            _unitOfWorkMock.Verify(u => u.Trades.AddAsync(trade), Times.Once);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateTradeAsync_ShouldKeepExistingEntryDateAndStatus_WhenAlreadyProvided()
        {
            // Arrange
            var createTradeDto = new CreateTradeDto();

            var entryDate = new DateTime(2025, 1, 1);
            var createdAtBeforeCall = DateTime.UtcNow;

            var trade = new Trade
            {
                EntryDate = entryDate,
                Status = "Closed"
            };

            var tradeDto = new TradeDto();

            _tradeValidatorMock
                .Setup(v => v.ValidateCreateTradeAsync(createTradeDto))
                .ReturnsAsync(AppStatus.Success);

            _mapperMock
                .Setup(m => m.Map<Trade>(createTradeDto))
                .Returns(trade);

            _mapperMock
                .Setup(m => m.Map<TradeDto>(trade))
                .Returns(tradeDto);

            _unitOfWorkMock
                .Setup(u => u.Trades.AddAsync(trade))
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.CompleteAsync())
                .ReturnsAsync(1);

            // Act
            var result = await _tradeService.CreateTradeAsync(createTradeDto);

            // Assert
            result.IsSuccess.Should().BeTrue();
            trade.EntryDate.Should().Be(entryDate);
            trade.Status.Should().Be("Closed");
            trade.CreatedAt.Should().BeOnOrAfter(createdAtBeforeCall);
        }

        [Fact]
        public async Task DeleteTradeAsync_ShouldReturnFalse_WhenTradeDoesNotExist()
        {
            // Arrange
            int tradeId = 10;

            _unitOfWorkMock
                .Setup(u => u.Trades.GetByIdAsync(tradeId))
                .ReturnsAsync((Trade?)null);

            // Act
            var result = await _tradeService.DeleteTradeAsync(tradeId);

            // Assert
            result.Should().BeFalse();
            _unitOfWorkMock.Verify(u => u.Trades.Delete(It.IsAny<Trade>()), Times.Never);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteTradeAsync_ShouldDeleteTradeAndReturnTrue_WhenTradeExists()
        {
            // Arrange
            int tradeId = 10;
            var trade = new Trade { Id = tradeId };

            _unitOfWorkMock
                .Setup(u => u.Trades.GetByIdAsync(tradeId))
                .ReturnsAsync(trade);

            _unitOfWorkMock
                .Setup(u => u.CompleteAsync())
                .ReturnsAsync(1);

            // Act
            var result = await _tradeService.DeleteTradeAsync(tradeId);

            // Assert
            result.Should().BeTrue();
            _unitOfWorkMock.Verify(u => u.Trades.Delete(trade), Times.Once);
            _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Once);
        }

        [Fact]
        public async Task GetTradeByIdAsync_ShouldReturnNull_WhenTradeDoesNotExist()
        {
            // Arrange
            int tradeId = 5;

            _unitOfWorkMock
                .Setup(u => u.Trades.GetByIdAsync(tradeId))
                .ReturnsAsync((Trade?)null);

            // Act
            var result = await _tradeService.GetTradeByIdAsync(tradeId);

            // Assert
            result.Should().BeNull();
            _mapperMock.Verify(m => m.Map<TradeDto>(It.IsAny<Trade>()), Times.Never);
        }

        [Fact]
        public async Task GetTradeByIdAsync_ShouldReturnMappedDto_WhenTradeExists()
        {
            // Arrange
            int tradeId = 5;
            var trade = new Trade { Id = tradeId };
            var tradeDto = new TradeDto { Id = tradeId };

            _unitOfWorkMock
                .Setup(u => u.Trades.GetByIdAsync(tradeId))
                .ReturnsAsync(trade);

            _mapperMock
                .Setup(m => m.Map<TradeDto>(trade))
                .Returns(tradeDto);

            // Act
            var result = await _tradeService.GetTradeByIdAsync(tradeId);

            // Assert
            result.Should().NotBeNull();
            result.Should().Be(tradeDto);
        }

        [Fact]
        public async Task GetTradesAsync_ShouldReturnMappedTrades()
        {
            // Arrange
            var trades = new List<Trade>
            {
                new Trade { Id = 1 },
                new Trade { Id = 2 }
            };

            var tradeDtos = new List<TradeDto>
            {
                new TradeDto { Id = 1 },
                new TradeDto { Id = 2 }
            };

            _unitOfWorkMock
                .Setup(u => u.Trades.GetAllAsync())
                .ReturnsAsync(trades);

            _mapperMock
                .Setup(m => m.Map<List<TradeDto>>(trades))
                .Returns(tradeDtos);

            // Act
            var result = await _tradeService.GetTradesAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.Should().BeEquivalentTo(tradeDtos);
        }
    }
}
