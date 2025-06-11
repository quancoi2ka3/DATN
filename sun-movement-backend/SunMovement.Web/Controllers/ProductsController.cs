using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;

namespace SunMovement.Web.Controllers
{
    public class ProductsController : Controller
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: /Products
        public async Task<IActionResult> Index(string category = null, string search = null, string sort = null, int page = 1)
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                products = products.Where(p => p.IsActive);

                // Apply category filter if specified
                if (!string.IsNullOrEmpty(category))
                {
                    // Try to parse as enum first
                    if (Enum.TryParse<ProductCategory>(category, true, out var productCategory))
                    {
                        products = products.Where(p => p.Category == productCategory);
                    }
                    // Also handle the case where the category might be passed as a number
                    else if (int.TryParse(category, out int categoryValue) && 
                             Enum.IsDefined(typeof(ProductCategory), categoryValue))
                    {
                        var enumCategory = (ProductCategory)categoryValue;
                        products = products.Where(p => p.Category == enumCategory);
                    }
                }

                // Apply search filter if specified
                if (!string.IsNullOrEmpty(search))
                {
                    products = products.Where(p =>
                        p.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        p.Description.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        p.SubCategory.Contains(search, StringComparison.OrdinalIgnoreCase));
                }

                // Apply sorting
                products = sort switch
                {
                    "price_asc" => products.OrderBy(p => p.Price),
                    "price_desc" => products.OrderByDescending(p => p.Price),
                    "name_asc" => products.OrderBy(p => p.Name),
                    "name_desc" => products.OrderByDescending(p => p.Name),
                    _ => products.OrderBy(p => p.Name),
                };

                // Generate ETag for caching purposes
                var etag = GenerateETag(products.ToList());
                
                // Check if client has the same version (using ETag)
                var requestETag = Request.Headers[HeaderNames.IfNoneMatch];
                if (!string.IsNullOrEmpty(requestETag) && requestETag.ToString() == etag)
                {
                    return StatusCode(304); // Not Modified
                }
                
                // Set ETag header
                Response.Headers[HeaderNames.ETag] = etag;
                
                // Set cache control headers - short cache time to ensure fresh content
                Response.Headers[HeaderNames.CacheControl] = "no-cache";

                // Pagination
                int pageSize = 12;
                var pagedProducts = products.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                var viewModel = new ProductsIndexViewModel
                {
                    Products = pagedProducts.Select(p => new ProductViewModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        ImageUrl = p.ImageUrl,
                        Category = GetCategoryDisplayName(p.Category),
                        IsAvailable = p.StockQuantity > 0,
                        StockQuantity = p.StockQuantity,
                        Brand = p.SubCategory,
                        DiscountPrice = p.DiscountPrice ?? 0
                    }),
                    CurrentPage = page,
                    TotalPages = (int)Math.Ceiling(products.Count() / (double)pageSize),
                    CurrentCategory = category,
                    CurrentSearch = search,
                    CurrentSort = sort
                };

                // Set very short cache duration to ensure fresh content
                Response.Headers["Cache-Control"] = "public, max-age=10";

                return View(viewModel);
            }
            catch (Exception ex)
            {
                // Log the error
                return View("Error", ex);
            }
        }

        // GET: /Products/Details/5
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null || !product.IsActive)
                {
                    return NotFound();
                }

                // Generate ETag for this specific product
                var etag = $"W/\"product-{id}-{product.UpdatedAt?.Ticks ?? product.CreatedAt.Ticks}\"";
                
                // Check if client has the same version
                var requestETag = Request.Headers[HeaderNames.IfNoneMatch];
                if (!string.IsNullOrEmpty(requestETag) && requestETag.ToString() == etag)
                {
                    return StatusCode(304); // Not Modified
                }
                
                // Set ETag and cache control headers
                Response.Headers[HeaderNames.ETag] = etag;
                Response.Headers[HeaderNames.CacheControl] = "no-cache";

                var viewModel = new ProductViewModel
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    Category = GetCategoryDisplayName(product.Category),
                    IsAvailable = product.StockQuantity > 0,
                    StockQuantity = product.StockQuantity,
                    Brand = product.SubCategory,
                    DiscountPrice = product.DiscountPrice ?? 0,
                    SKU = product.Id.ToString("D6")
                };

                return View(viewModel);
            }
            catch (Exception ex)
            {
                // Log the error
                return View("Error", ex);
            }
        }
        
        // Helper method to generate ETag for product collections
        private string GenerateETag(IEnumerable<Product> products)
        {
            // Use the latest UpdatedAt timestamp from any product as the ETag
            var latestUpdate = products.Max(p => p.UpdatedAt ?? p.CreatedAt);
            return $"W/\"products-{latestUpdate.Ticks}-{products.Count()}\"";
        }

        // Helper method to convert enum to display name
        private string GetCategoryDisplayName(ProductCategory category)
        {
            return category switch
            {
                ProductCategory.Sportswear => "Sportwear",
                ProductCategory.Supplements => "Supplement",
                _ => "Unknown" // Handle unexpected values
            };
        }
    }
}
