using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
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
                context.ShoppingCarts.Add(new ShoppingCart { Id = 1, UserId = userId });
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
                var cart = new ShoppingCart { Id = 1, UserId = userId };
                cart.Items = new List<CartItem>
                {
                    new CartItem { Id = 1, CartId = 1, ProductId = 1, ItemName = "Product 1", Quantity = 2, UnitPrice = 19.99m },
                    new CartItem { Id = 2, CartId = 1, ServiceId = 1, ItemName = "Service 1", Quantity = 1, UnitPrice = 29.99m }
                };
                context.ShoppingCarts.Add(cart);
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
                await repository.AddAsync(cart);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new ApplicationDbContext(options))
            {
                var savedCart = await context.ShoppingCarts.FirstOrDefaultAsync(c => c.UserId == "user123");
                Assert.NotNull(savedCart);
            }
        }

        [Fact]
        public async Task UpdateCartItemAsync_ExistingItem_UpdatesItem()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(UpdateCartItemAsync_ExistingItem_UpdatesItem));
            var cartItem = new CartItem 
            { 
                Id = 1, 
                CartId = 1, 
                ProductId = 1, 
                ItemName = "Product 1", 
                Quantity = 2, 
                UnitPrice = 19.99m 
            };

            // Seed the database
            using (var context = new ApplicationDbContext(options))
            {
                context.CartItems.Add(cartItem);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                
                var itemToUpdate = await context.CartItems.FindAsync(1);
                itemToUpdate.Quantity = 5;
                
                repository.UpdateCartItem(itemToUpdate);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new ApplicationDbContext(options))
            {
                var updatedItem = await context.CartItems.FindAsync(1);
                Assert.Equal(5, updatedItem.Quantity);
            }
        }

        [Fact]
        public async Task DeleteCartItemAsync_ExistingItem_DeletesItem()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(DeleteCartItemAsync_ExistingItem_DeletesItem));
            var cartItem = new CartItem 
            { 
                Id = 1, 
                CartId = 1, 
                ProductId = 1, 
                ItemName = "Product 1", 
                Quantity = 2, 
                UnitPrice = 19.99m 
            };

            // Seed the database
            using (var context = new ApplicationDbContext(options))
            {
                context.CartItems.Add(cartItem);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                await repository.DeleteCartItemAsync(1);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new ApplicationDbContext(options))
            {
                var deletedItem = await context.CartItems.FindAsync(1);
                Assert.Null(deletedItem);
            }
        }

        [Fact]
        public async Task ClearCartAsync_ExistingCart_RemovesAllItems()
        {
            // Arrange
            var options = GetDbContextOptions(nameof(ClearCartAsync_ExistingCart_RemovesAllItems));
            var cart = new ShoppingCart { Id = 1, UserId = "user123" };
            cart.Items = new List<CartItem>
            {
                new CartItem { Id = 1, CartId = 1, ProductId = 1, ItemName = "Product 1", Quantity = 2, UnitPrice = 19.99m },
                new CartItem { Id = 2, CartId = 1, ServiceId = 1, ItemName = "Service 1", Quantity = 1, UnitPrice = 29.99m }
            };

            // Seed the database
            using (var context = new ApplicationDbContext(options))
            {
                context.ShoppingCarts.Add(cart);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ShoppingCartRepository(context);
                await repository.ClearCartAsync(1);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new ApplicationDbContext(options))
            {
                var cartItems = await context.CartItems.Where(i => i.CartId == 1).ToListAsync();
                Assert.Empty(cartItems);
            }
        }
    }
}
