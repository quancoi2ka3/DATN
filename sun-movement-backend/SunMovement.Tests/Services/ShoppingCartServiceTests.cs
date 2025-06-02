using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using Xunit;

namespace SunMovement.Tests.Services
{
    public class ShoppingCartServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IMemoryCache> _mockCache;
        private readonly Mock<ILogger<ShoppingCartService>> _mockLogger;
        private readonly ShoppingCartService _service;

        public ShoppingCartServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockCache = new Mock<IMemoryCache>();
            _mockLogger = new Mock<ILogger<ShoppingCartService>>();
            _service = new ShoppingCartService(_mockUnitOfWork.Object, _mockCache.Object, _mockLogger.Object);

            SetupCache();
        }

        private void SetupCache()
        {
            var cacheEntry = Mock.Of<ICacheEntry>();
            _mockCache
                .Setup(m => m.CreateEntry(It.IsAny<object>()))
                .Returns(cacheEntry);
        }

        [Fact]
        public async Task GetOrCreateCartAsync_ExistingCart_ReturnsCart()
        {
            // Arrange
            var userId = "user123";
            var cart = new ShoppingCart { Id = 1, UserId = userId };
            
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartByUserIdAsync(userId))
                .ReturnsAsync(cart);

            // Act
            var result = await _service.GetOrCreateCartAsync(userId);

            // Assert
            Assert.Equal(cart.Id, result.Id);
            Assert.Equal(userId, result.UserId);
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartByUserIdAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Never);
        }

        [Fact]
        public async Task GetOrCreateCartAsync_NoExistingCart_CreatesAndReturnsNewCart()
        {
            // Arrange
            var userId = "user123";
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartByUserIdAsync(userId))
                .ReturnsAsync((ShoppingCart)null);

            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.AddAsync(It.IsAny<ShoppingCart>()))
                .Callback<ShoppingCart>(cart => cart.Id = 1);

            // Act
            var result = await _service.GetOrCreateCartAsync(userId);

            // Assert
            Assert.Equal(1, result.Id);
            Assert.Equal(userId, result.UserId);
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartByUserIdAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.AddAsync(It.IsAny<ShoppingCart>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Fact]
        public async Task AddItemToCartAsync_NewItem_AddsItemToCart()
        {
            // Arrange
            var userId = "user123";
            var productId = 1;
            var itemName = "Test Product";
            var imageUrl = "image.jpg";
            var unitPrice = 19.99m;
            var quantity = 2;

            var cart = new ShoppingCart { Id = 1, UserId = userId, Items = new List<CartItem>() };
            
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId))
                .ReturnsAsync(cart);

            // Act
            await _service.AddItemToCartAsync(userId, productId, null, itemName, imageUrl, unitPrice, quantity);

            // Assert
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
            Assert.Single(cart.Items);
            Assert.Equal(productId, cart.Items[0].ProductId);
            Assert.Equal(quantity, cart.Items[0].Quantity);
            Assert.Equal(unitPrice, cart.Items[0].UnitPrice);
        }

        [Fact]
        public async Task AddItemToCartAsync_ExistingItem_UpdatesQuantity()
        {
            // Arrange
            var userId = "user123";
            var productId = 1;
            var itemName = "Test Product";
            var imageUrl = "image.jpg";
            var unitPrice = 19.99m;
            var initialQuantity = 2;
            var additionalQuantity = 3;

            var existingItem = new CartItem
            {
                Id = 1,
                ProductId = productId,
                ItemName = itemName,
                ItemImageUrl = imageUrl,
                UnitPrice = unitPrice,
                Quantity = initialQuantity
            };

            var cart = new ShoppingCart 
            { 
                Id = 1, 
                UserId = userId, 
                Items = new List<CartItem> { existingItem }
            };
            
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId))
                .ReturnsAsync(cart);

            // Act
            await _service.AddItemToCartAsync(userId, productId, null, itemName, imageUrl, unitPrice, additionalQuantity);

            // Assert
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
            Assert.Single(cart.Items);
            Assert.Equal(initialQuantity + additionalQuantity, cart.Items[0].Quantity);
        }

        [Fact]
        public async Task RemoveItemFromCartAsync_ExistingItem_RemovesItem()
        {
            // Arrange
            var userId = "user123";
            var itemId = 1;

            var existingItem = new CartItem { Id = itemId };
            var cart = new ShoppingCart 
            { 
                Id = 1, 
                UserId = userId, 
                Items = new List<CartItem> { existingItem }
            };
            
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId))
                .ReturnsAsync(cart);

            // Act
            await _service.RemoveItemFromCartAsync(userId, itemId);

            // Assert
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.DeleteCartItemAsync(itemId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateCartItemQuantityAsync_ExistingItem_UpdatesQuantity()
        {
            // Arrange
            var userId = "user123";
            var itemId = 1;
            var newQuantity = 5;

            var existingItem = new CartItem { Id = itemId, Quantity = 2 };
            var cart = new ShoppingCart 
            { 
                Id = 1, 
                UserId = userId, 
                Items = new List<CartItem> { existingItem }
            };
            
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId))
                .ReturnsAsync(cart);

            // Act
            await _service.UpdateCartItemQuantityAsync(userId, itemId, newQuantity);

            // Assert
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
            Assert.Equal(newQuantity, existingItem.Quantity);
        }

        [Fact]
        public async Task ClearCartAsync_ExistingCart_ClearsAllItems()
        {
            // Arrange
            var userId = "user123";
            var cart = new ShoppingCart { Id = 1, UserId = userId };
            
            _mockUnitOfWork.Setup(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId))
                .ReturnsAsync(cart);

            // Act
            await _service.ClearCartAsync(userId);

            // Assert
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.GetCartWithItemsAsync(userId), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.ShoppingCarts.ClearCartAsync(cart.Id), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }
    }
}
