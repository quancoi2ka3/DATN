using Microsoft.AspNetCore.Mvc;
using Moq;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using SunMovement.Web.Controllers.Api;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace SunMovement.Tests.Controllers
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductService> _mockProductService;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _mockProductService = new Mock<IProductService>();
            _controller = new ProductsController(_mockProductService.Object);
        }

        [Fact]
        public async Task GetProducts_ReturnsOkWithProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Product 1", Price = 10.99m },
                new Product { Id = 2, Name = "Product 2", Price = 20.99m }
            };

            _mockProductService.Setup(service => service.GetAllProductsAsync())
                .ReturnsAsync(products);

            // Act
            var result = await _controller.GetProducts();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProducts = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(okResult.Value);
            Assert.Equal(2, returnedProducts.Count());
        }

        [Fact]
        public async Task GetProduct_ReturnsOkWithProduct_WhenProductExists()
        {
            // Arrange
            var product = new Product { Id = 1, Name = "Product 1", Price = 10.99m };

            _mockProductService.Setup(service => service.GetProductByIdAsync(1))
                .ReturnsAsync(product);

            // Act
            var result = await _controller.GetProduct(1);

            // Assert
            var okResult = Assert.IsType<ActionResult<ProductDto>>(result);
            var returnedProduct = Assert.IsType<ProductDto>(okResult.Value);
            Assert.Equal(1, returnedProduct.Id);
            Assert.Equal("Product 1", returnedProduct.Name);
        }

        [Fact]
        public async Task GetProduct_ReturnsNotFound_WhenProductDoesNotExist()
        {
            // Arrange
            _mockProductService.Setup(service => service.GetProductByIdAsync(999))
                .ReturnsAsync((Product)null);

            // Act
            var result = await _controller.GetProduct(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetProductsByCategory_ReturnsOkWithFilteredProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "T-Shirt", Category = ProductCategory.Sportswear }
            };

            _mockProductService.Setup(service => service.GetProductsByCategoryAsync(ProductCategory.Sportswear))
                .ReturnsAsync(products);

            // Act
            var result = await _controller.GetProductsByCategory("Sportswear");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProducts = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(okResult.Value);
            Assert.Single(returnedProducts);
            Assert.Equal("T-Shirt", returnedProducts.First().Name);
        }

        [Fact]
        public async Task GetProductsByCategory_ReturnsBadRequest_ForInvalidCategory()
        {
            // Act
            var result = await _controller.GetProductsByCategory("InvalidCategory");

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateProduct_ReturnsCreatedAtAction_WithNewProduct()
        {
            // Arrange
            var productDto = new ProductDto
            {
                Name = "New Product",
                Description = "Description",
                Price = 15.99m,
                Category = ProductCategory.Supplements
            };

            var createdProduct = new Product
            {
                Id = 3,
                Name = "New Product",
                Description = "Description",
                Price = 15.99m,
                Category = ProductCategory.Supplements
            };

            _mockProductService.Setup(service => service.CreateProductAsync(It.IsAny<Product>()))
                .ReturnsAsync(createdProduct);

            // Act
            var result = await _controller.CreateProduct(productDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedProduct = Assert.IsType<ProductDto>(createdAtActionResult.Value);
            Assert.Equal(3, returnedProduct.Id);
            Assert.Equal("New Product", returnedProduct.Name);
        }
    }
}
