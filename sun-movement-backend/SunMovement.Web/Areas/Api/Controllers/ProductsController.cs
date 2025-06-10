using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Areas.Api.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            var productDtos = products.Select(MapToDto);
            return Ok(productDtos);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return MapToDto(product);
        }        // GET: api/products/category/sportswear
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(string category)
        {
            try
            {
                // Check if the category string is null or empty
                if (string.IsNullOrWhiteSpace(category))
                {
                    return BadRequest("Category cannot be empty");
                }

                // Try to parse the category string to enum with case insensitive comparison
                if (!Enum.TryParse<ProductCategory>(category, ignoreCase: true, out var productCategory))
                {
                    return BadRequest($"Invalid category: {category}. Available categories: {string.Join(", ", Enum.GetNames(typeof(ProductCategory)))}");
                }

                var products = await _productService.GetProductsByCategoryAsync(productCategory);
                return Ok(products.Select(MapToDto));
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in GetProductsByCategory: {ex.Message}");
                return StatusCode(500, $"Internal server error while retrieving products for category '{category}': {ex.Message}");
            }
        }
        
        // POST: api/products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto productDto)
        {
            try
            {
                var product = MapFromDto(productDto);
                var createdProduct = await _productService.CreateProductAsync(product);
                
                productDto.Id = createdProduct.Id;
                return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, productDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest();
            }

            try
            {
                var product = MapFromDto(productDto);
                await _productService.UpdateProductAsync(product);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                await _productService.DeleteProductAsync(id);
                return NoContent();
            }
            catch (Exception ex)            {
                return BadRequest(ex.Message);
            }
        }
        
        // PATCH: api/products/5/stock
        [HttpPatch("{id}/stock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] StockUpdateModel model)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound();
                }
                
                product.StockQuantity = model.Quantity;
                await _productService.UpdateProductAsync(product);
                return NoContent();
            }
            catch (Exception ex)            {
                return BadRequest(ex.Message);
            }
        }

        // Utility methods for mapping between entity and DTO
        private ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl ?? string.Empty,
                Category = product.Category,
                StockQuantity = product.StockQuantity,
                SubCategory = product.SubCategory,
                DiscountPrice = product.DiscountPrice,
                Specifications = product.Specifications ?? string.Empty,
                IsFeatured = product.IsFeatured,
                IsActive = product.IsActive
            };
        }

        private Product MapFromDto(ProductDto dto)
        {
            return new Product
            {
                Id = dto.Id,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Category = dto.Category,
                StockQuantity = dto.StockQuantity,
                SubCategory = dto.SubCategory,
                DiscountPrice = dto.DiscountPrice,
                Specifications = dto.Specifications,
                IsFeatured = dto.IsFeatured,
                IsActive = dto.IsActive            };
        }
    }
}
