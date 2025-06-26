using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Repositories;
using Xunit;

namespace SunMovement.Tests.Repositories
{
    public class ShoppingCartRepositoryTests
    {
        private DbContextOptions<ApplicationDbContext> GetDbContextOptions(string dbName)
        {
            return new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
        }

        [Fact]
        public async Task GetCartByUserIdAsync_ExistingCart_ReturnsCart()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(GetCartByUserIdAsync_ExistingCart_ReturnsCart));
            var userId = "user123";

            // Seed the database
            using (var context = new ApplicationDbContext(options))
            {
                context.ShoppingCarts.Add(new ShoppingCart { UserId = userId });
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                var result = await repository.GetCartByUserIdAsync(userId);

                // Assert
                Assert.NotNull(result);
                Assert.Equal(userId, result.UserId);
            }
        }

        [Fact]
        public async Task GetCartByUserIdAsync_NonExistingCart_ReturnsNull()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(GetCartByUserIdAsync_NonExistingCart_ReturnsNull));
            
            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                var result = await repository.GetCartByUserIdAsync("nonexistentuser");

                // Assert
                Assert.Null(result);
            }
        }

        [Fact]
        public async Task GetCartWithItemsAsync_ExistingCart_ReturnsCartWithItems()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(GetCartWithItemsAsync_ExistingCart_ReturnsCartWithItems));
            var userId = "user123";

            // Seed the database
            using (var context = new ApplicationDbContext(options))
            {
                var cart = new ShoppingCart { UserId = userId };
                context.ShoppingCarts.Add(cart);
                await context.SaveChangesAsync();

                // Add items to cart
                var cartItems = new List<CartItem>
                {
                    new CartItem { ShoppingCartId = cart.Id, ProductId = 1, ItemName = "Product 1", Quantity = 2, UnitPrice = 19.99m },
                    new CartItem { ShoppingCartId = cart.Id, ServiceId = 1, ItemName = "Service 1", Quantity = 1, UnitPrice = 29.99m }
                };
                context.CartItems.AddRange(cartItems);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                var result = await repository.GetCartWithItemsAsync(userId);

                // Assert
                Assert.NotNull(result);
                Assert.Equal(userId, result.UserId);
                Assert.Equal(2, result.Items.Count);
            }
        }

        [Fact]
        public async Task AddAsync_ValidCart_AddsCart()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(AddAsync_ValidCart_AddsCart));
            var cart = new ShoppingCart { UserId = "user123" };

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                var result = await repository.AddAsync(cart);

                // Assert
                Assert.NotNull(result);
                Assert.True(result.Id > 0);
                Assert.Equal("user123", result.UserId);
            }

            // Verify in database
            using (var context = new ApplicationDbContext(options))
            {
                var savedCart = await context.ShoppingCarts.FirstAsync();
                Assert.Equal("user123", savedCart.UserId);
            }
        }

        [Fact]
        public async Task GetCartItemAsync_ExistingCartItem_ReturnsCartItem()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(GetCartItemAsync_ExistingCartItem_ReturnsCartItem));
            
            using (var context = new ApplicationDbContext(options))
            {
                var cart = new ShoppingCart { UserId = "user123" };
                context.ShoppingCarts.Add(cart);
                await context.SaveChangesAsync();

                var cartItem = new CartItem 
                { 
                    ShoppingCartId = cart.Id, 
                    ProductId = 1, 
                    ItemName = "Test Product", 
                    Quantity = 1, 
                    UnitPrice = 19.99m 
                };
                context.CartItems.Add(cartItem);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                var cartItem = await context.CartItems.FirstAsync();
                var result = await repository.GetCartItemAsync(cartItem.Id);

                // Assert
                Assert.NotNull(result);
                Assert.Equal("Test Product", result.ItemName);
                Assert.Equal(1, result.Quantity);
                Assert.Equal(19.99m, result.UnitPrice);
            }
        }
    }
}
