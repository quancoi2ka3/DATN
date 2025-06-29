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

        // Integrated System Methods - Product-Inventory Integration

        public async Task<Product> CreateProductFromInventoryAsync(
            int inventoryItemId, 
            string name, 
            decimal price, 
            string description, 
            ProductCategory category, 
            string subCategory, 
            decimal? discountPrice = null, 
            string? sku = null, 
            string? barcode = null, 
            decimal weight = 0, 
            string? dimensions = null, 
            int minimumStockLevel = 5, 
            int optimalStockLevel = 50, 
            bool isFeatured = false, 
            bool trackInventory = true, 
            bool allowBackorder = false)
        {
            // For create operations, we don't use cache. Just delegate and invalidate relevant caches
            var product = await _productService.CreateProductFromInventoryAsync(
                inventoryItemId, name, price, description, category, subCategory, discountPrice, sku,
                barcode, weight, dimensions, minimumStockLevel, optimalStockLevel, isFeatured, trackInventory, allowBackorder);
            
            // Invalidate relevant caches
            _cacheService.Remove(AllProductsCacheKey);
            _cacheService.Remove($"{ProductCategoryPrefix}{category}");
            if (isFeatured)
                _cacheService.Remove(FeaturedProductsCacheKey);
            
            return product;
        }

        public async Task ApplyCouponsToProductAsync(int productId, List<int> couponIds)
        {
            await _productService.ApplyCouponsToProductAsync(productId, couponIds);
            
            // Invalidate product cache
            _cacheService.Remove($"{ProductCachePrefix}{productId}");
        }

        public async Task RemoveCouponsFromProductAsync(int productId, List<int> couponIds)
        {
            await _productService.RemoveCouponsFromProductAsync(productId, couponIds);
            
            // Invalidate product cache
            _cacheService.Remove($"{ProductCachePrefix}{productId}");
        }

        public async Task<IEnumerable<Coupon>> GetProductCouponsAsync(int productId)
        {
            // This is read-only and could be cached, but let's keep it simple for now
            return await _productService.GetProductCouponsAsync(productId);
        }

        public async Task<IEnumerable<Product>> GetProductsWithLowStockAsync()
        {
            // This should not be cached as inventory levels change frequently
            return await _productService.GetProductsWithLowStockAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsBySupplierAsync(int supplierId)
        {
            var cacheKey = $"ProductsBySupplier_{supplierId}";
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _productService.GetProductsBySupplierAsync(supplierId);
            _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
            return products;
        }

        public async Task UpdateProductStockAsync(int productId, int newStockQuantity, string notes)
        {
            await _productService.UpdateProductStockAsync(productId, newStockQuantity, notes);
            
            // Invalidate caches
            _cacheService.Remove($"{ProductCachePrefix}{productId}");
            _cacheService.Remove(AllProductsCacheKey);
        }

        public async Task<decimal> CalculateProductProfitAsync(int productId)
        {
            // This calculation could be cached but might change frequently. Let's delegate directly.
            return await _productService.CalculateProductProfitAsync(productId);
        }

        public async Task<IEnumerable<Product>> GetProductsCreatedFromInventoryAsync(int inventoryItemId)
        {
            var cacheKey = $"ProductsFromInventory_{inventoryItemId}";
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _productService.GetProductsCreatedFromInventoryAsync(inventoryItemId);
            _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
            return products;
        }
    }
}
