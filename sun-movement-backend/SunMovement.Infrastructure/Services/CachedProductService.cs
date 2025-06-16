using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    public class CachedProductService : IProductService
    {
        private readonly IProductService _productService;
        private readonly ICacheService _cacheService;
        private const string AllProductsCacheKey = "AllProducts";
        private const string ProductCachePrefix = "Product_";
        private const string ProductCategoryPrefix = "ProductCategory_";
        private const string FeaturedProductsCacheKey = "FeaturedProducts";
        private const string SearchProductsPrefix = "SearchProducts_";

        public CachedProductService(IProductService productService, ICacheService cacheService)
        {
            _productService = productService;
            _cacheService = cacheService;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(AllProductsCacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _productService.GetAllProductsAsync();
            _cacheService.Set(AllProductsCacheKey, products, TimeSpan.FromMinutes(10));
            return products;
        }        public async Task<Product> GetProductByIdAsync(int id)
        {
            var cacheKey = $"{ProductCachePrefix}{id}";
            var cachedProduct = _cacheService.Get<Product>(cacheKey);
            if (cachedProduct != null)
            {
                return cachedProduct;
            }

            var product = await _productService.GetProductByIdAsync(id);
            if (product != null)
            {
                _cacheService.Set(cacheKey, product, TimeSpan.FromMinutes(10));
                return product;
            }
            return new Product();
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            var cacheKey = $"{ProductCategoryPrefix}{category}";
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _productService.GetProductsByCategoryAsync(category);
            _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
            return products;
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(FeaturedProductsCacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _productService.GetFeaturedProductsAsync();
            _cacheService.Set(FeaturedProductsCacheKey, products, TimeSpan.FromMinutes(10));
            return products;
        }        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            var normalizedQuery = query?.Trim().ToLower() ?? string.Empty;
            var cacheKey = $"{SearchProductsPrefix}{normalizedQuery}";
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _productService.SearchProductsAsync(query ?? string.Empty);
            _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
            return products;
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            var result = await _productService.CreateProductAsync(product);
            InvalidateProductCaches();
            return result;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            var result = await _productService.UpdateProductAsync(product);
            InvalidateProductCaches(product.Id);
            return result;
        }

        public async Task DeleteProductAsync(int id)
        {
            await _productService.DeleteProductAsync(id);
            InvalidateProductCaches(id);
        }

        private void InvalidateProductCaches(int? productId = null)
        {
            _cacheService.Remove(AllProductsCacheKey);
            _cacheService.Remove(FeaturedProductsCacheKey);
            _cacheService.RemoveByPrefix(SearchProductsPrefix);
            _cacheService.RemoveByPrefix(ProductCategoryPrefix);
            
            if (productId.HasValue)
            {
                _cacheService.Remove($"{ProductCachePrefix}{productId.Value}");
            }
        }
    }
}
