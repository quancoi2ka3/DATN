using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace SunMovement.Tests.Repositories
{
    public class ProductRepositoryTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsProduct_WhenProductExists()
        {
            // Arrange
            using var context = GetDbContext();
            var product = new Product
            {
                Name = "Test Product",
                Description = "Test Description",
                Price = 19.99m,
                Category = ProductCategory.Sportswear,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);

            // Act
            var result = await repository.GetByIdAsync(product.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Product", result.Name);
            Assert.Equal(19.99m, result.Price);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenProductDoesNotExist()
        {
            // Arrange
            using var context = GetDbContext();
            var repository = new ProductRepository(context);

            // Act
            var result = await repository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllProducts()
        {
            // Arrange
            using var context = GetDbContext();
            var products = new[]
            {
                new Product { Name = "Product 1", Price = 10.99m, Category = ProductCategory.Sportswear, IsActive = true },
                new Product { Name = "Product 2", Price = 20.99m, Category = ProductCategory.Supplements, IsActive = true },
                new Product { Name = "Product 3", Price = 30.99m, Category = ProductCategory.Sportswear, IsActive = false }
            };
            context.Products.AddRange(products);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);

            // Act
            var result = await repository.GetAllAsync();

            // Assert
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task AddAsync_ReturnsAddedProduct()
        {
            // Arrange
            using var context = GetDbContext();
            var repository = new ProductRepository(context);
            var product = new Product
            {
                Name = "New Product",
                Description = "New Description",
                Price = 25.99m,
                Category = ProductCategory.Supplements,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            // Act
            var result = await repository.AddAsync(product);
            await context.SaveChangesAsync();

            // Assert
            Assert.NotEqual(0, result.Id);
            Assert.Equal("New Product", result.Name);
            Assert.Equal(1, context.Products.Count());
        }

        [Fact]
        public async Task UpdateAsync_ReturnsUpdatedProduct()
        {
            // Arrange
            using var context = GetDbContext();
            var product = new Product
            {
                Name = "Original Product",
                Description = "Original Description",
                Price = 15.99m,
                Category = ProductCategory.Sportswear,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);
            
            // Update properties
            product.Name = "Updated Product";
            product.Price = 18.99m;

            // Act
            var result = await repository.UpdateAsync(product);
            await context.SaveChangesAsync();

            // Assert
            Assert.Equal("Updated Product", result.Name);
            Assert.Equal(18.99m, result.Price);
            
            // Verify in database
            var updatedProduct = await context.Products.FindAsync(product.Id);
            Assert.Equal("Updated Product", updatedProduct.Name);
            Assert.Equal(18.99m, updatedProduct.Price);
        }

        [Fact]
        public async Task DeleteAsync_RemovesProduct()
        {
            // Arrange
            using var context = GetDbContext();
            var product = new Product
            {
                Name = "Product to Delete",
                Description = "Description",
                Price = 12.99m,
                Category = ProductCategory.Sportswear,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var repository = new ProductRepository(context);

            // Act
            await repository.DeleteAsync(product);
            await context.SaveChangesAsync();

            // Assert
            Assert.Empty(context.Products);
        }
    }
}
