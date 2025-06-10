using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private const string AllProductsCacheKey = "AllProducts";
        private const string ProductCategoryPrefix = "ProductCategory_";
        private const string FeaturedProductsCacheKey = "FeaturedProducts";
        private const string SearchProductsPrefix = "SearchProducts_";

        public ProductService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            // Try to get from cache first
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(AllProductsCacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            // If not in cache, get from database
            var products = await _unitOfWork.Products.GetAllAsync();
            
            // Store in cache for future requests
            _cacheService.Set(AllProductsCacheKey, products, TimeSpan.FromMinutes(10));
            
            return products;
        }        public async Task<Product> GetProductByIdAsync(int id)
        {
            var cacheKey = $"Product_{id}";
            var cachedProduct = _cacheService.Get<Product>(cacheKey);
            if (cachedProduct != null)
            {
                return cachedProduct;
            }

            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product != null)
            {
                _cacheService.Set(cacheKey, product, TimeSpan.FromMinutes(10));
                return product;
            }
            
            return null!; // Return null as product was not found
        }public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            try
            {
                var cacheKey = $"{ProductCategoryPrefix}{category}";
                
                // Try to get from cache first
                var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
                if (cachedProducts != null)
                {
                    return cachedProducts;
                }

                // If not in cache, get from database
                var products = await _unitOfWork.Products.GetProductsByCategoryAsync(category);
                
                // Check if products is null (shouldn't happen but to be safe)
                if (products == null)
                {
                    return Enumerable.Empty<Product>();
                }
                
                // Store in cache for future requests
                _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
                
                return products;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in ProductService.GetProductsByCategoryAsync: {ex.Message}");
                throw new Exception($"Failed to retrieve products for category {category}", ex);
            }
        }public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(FeaturedProductsCacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _unitOfWork.Products.GetFeaturedProductsAsync();
            _cacheService.Set(FeaturedProductsCacheKey, products, TimeSpan.FromMinutes(10));
            
            return products;
        }        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            try
            {
                // Normalize the query to create a consistent cache key
                var normalizedQuery = query?.Trim().ToLower() ?? string.Empty;
                var cacheKey = $"{SearchProductsPrefix}{normalizedQuery}";
                
                var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
                if (cachedProducts != null)
                {
                    return cachedProducts;
                }

                // Ensure query is not null before sending to the repository
                var searchQuery = string.IsNullOrEmpty(query) ? string.Empty : query;
                var products = await _unitOfWork.Products.SearchProductsAsync(searchQuery);
                
                _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
                
                return products;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in SearchProductsAsync: {ex.Message}");
                return Enumerable.Empty<Product>();
            }
        }public async Task<Product> CreateProductAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            
            // Clear all related product caches
            InvalidateProductCaches();
            
            return result;
        }        public async Task<Product> UpdateProductAsync(Product product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.CompleteAsync();
            
            // Invalidate specific product cache and related caches
            InvalidateProductCaches(product.Id);
            
            return result;
        }        public async Task DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product != null)
            {
                await _unitOfWork.Products.DeleteAsync(product);
                await _unitOfWork.CompleteAsync();
                
                // Invalidate specific product cache and related caches
                InvalidateProductCaches(id);
            }
        }        // Helper method to invalidate product-related caches
        private void InvalidateProductCaches(int? productId = null)
        {
            // Always invalidate the list caches
            _cacheService.Remove(AllProductsCacheKey);
            _cacheService.Remove(FeaturedProductsCacheKey);
            
            // Remove any search cache keys (simplified approach - clear all search cache)
            _cacheService.RemoveByPrefix(SearchProductsPrefix);
            
            // Remove category caches (simplified approach - clear all category cache)
            _cacheService.RemoveByPrefix(ProductCategoryPrefix);
            
            // If a specific product ID is provided, remove that product's cache
            if (productId.HasValue)
            {
                _cacheService.Remove($"Product_{productId.Value}");
            }
        }
    }
}
