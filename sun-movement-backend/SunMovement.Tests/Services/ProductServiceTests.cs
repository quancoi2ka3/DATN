using Microsoft.EntityFrameworkCore;
using Moq;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using SunMovement.Infrastructure.Data;
using SunMovement.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace SunMovement.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly IProductService _productService;

        public ProductServiceTests()
        {
            _mockProductRepository = new Mock<IProductRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(uow => uow.Products).Returns(_mockProductRepository.Object);
            _productService = new ProductService(_mockUnitOfWork.Object);
        }

        [Fact]
        public async Task GetAllProductsAsync_ReturnsAllProducts()
        {
            // Arrange
            var expectedProducts = new List<Product>
            {
                new Product { Id = 1, Name = "Product 1", Price = 10.99m },
                new Product { Id = 2, Name = "Product 2", Price = 20.99m }
            };

            _mockProductRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(expectedProducts);

            // Act
            var result = await _productService.GetAllProductsAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(expectedProducts, result);
        }

        [Fact]
        public async Task GetProductByIdAsync_ReturnsProduct_WhenProductExists()
        {
            // Arrange
            var expectedProduct = new Product { Id = 1, Name = "Product 1", Price = 10.99m };

            _mockProductRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(expectedProduct);

            // Act
            var result = await _productService.GetProductByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedProduct, result);
        }

        [Fact]
        public async Task GetProductByIdAsync_ReturnsNull_WhenProductDoesNotExist()
        {
            // Arrange
            _mockProductRepository.Setup(repo => repo.GetByIdAsync(999))
                .ReturnsAsync((Product)null);

            // Act
            var result = await _productService.GetProductByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetProductsByCategoryAsync_ReturnsFilteredProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "T-Shirt", Category = ProductCategory.Sportswear },
                new Product { Id = 2, Name = "Protein", Category = ProductCategory.Supplements }
            };

            _mockProductRepository.Setup(repo => repo.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Product, bool>>>()))
                .ReturnsAsync((System.Linq.Expressions.Expression<Func<Product, bool>> predicate) => 
                    products.Where(predicate.Compile()).ToList());

            // Act
            var result = await _productService.GetProductsByCategoryAsync(ProductCategory.Sportswear);

            // Assert
            Assert.Single(result);
            Assert.Equal("T-Shirt", result.First().Name);
        }

        [Fact]
        public async Task CreateProductAsync_ReturnsCreatedProduct()
        {
            // Arrange
            var newProduct = new Product { Name = "New Product", Price = 15.99m };
            var createdProduct = new Product { Id = 3, Name = "New Product", Price = 15.99m };

            _mockProductRepository.Setup(repo => repo.AddAsync(newProduct))
                .ReturnsAsync(createdProduct);

            // Act
            var result = await _productService.CreateProductAsync(newProduct);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Id);
            Assert.Equal("New Product", result.Name);
        }
    }
}
