using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Controllers.Api
{
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
        }

        // GET: api/products/category/sportswear
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(string category)
        {
            if (!Enum.TryParse<ProductCategory>(category, true, out var productCategory))
            {
                return BadRequest("Invalid category");
            }

            var products = await _productService.GetProductsByCategoryAsync(productCategory);
            var productDtos = products.Select(MapToDto);
            return Ok(productDtos);
        }

        // GET: api/products/featured
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetFeaturedProducts()
        {
            var products = await _productService.GetFeaturedProductsAsync();
            var productDtos = products.Select(MapToDto);
            return Ok(productDtos);
        }

        // GET: api/products/search?q=protein
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> SearchProducts([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest("Search query is required");
            }

            var products = await _productService.SearchProductsAsync(q);
            var productDtos = products.Select(MapToDto);
            return Ok(productDtos);
        }

        // POST: api/products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto productDto)
        {
            var product = MapToEntity(productDto);
            product = await _productService.CreateProductAsync(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, MapToDto(product));
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

            var existingProduct = await _productService.GetProductByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            var product = MapToEntity(productDto, existingProduct);
            await _productService.UpdateProductAsync(product);
            return NoContent();
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            await _productService.DeleteProductAsync(id);
            return NoContent();
        }

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                StockQuantity = product.StockQuantity,
                Category = product.Category,
                SubCategory = product.SubCategory,
                Specifications = product.Specifications,
                IsFeatured = product.IsFeatured,
                IsActive = product.IsActive
            };
        }

        private static Product MapToEntity(ProductDto dto, Product existingProduct = null)
        {
            var product = existingProduct ?? new Product();
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.ImageUrl = dto.ImageUrl;
            product.Price = dto.Price;
            product.DiscountPrice = dto.DiscountPrice;
            product.StockQuantity = dto.StockQuantity;
            product.Category = dto.Category;
            product.SubCategory = dto.SubCategory;
            product.Specifications = dto.Specifications;
            product.IsFeatured = dto.IsFeatured;
            product.IsActive = dto.IsActive;
            return product;
        }
    }
}
