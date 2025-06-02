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
            }
            
            return product;
        }        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            var cacheKey = $"{ProductCategoryPrefix}{category}";
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _unitOfWork.Products.GetProductsByCategoryAsync(category);
            _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
            
            return products;
        }        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
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
            // Normalize the query to create a consistent cache key
            var normalizedQuery = query?.Trim().ToLower() ?? string.Empty;
            var cacheKey = $"{SearchProductsPrefix}{normalizedQuery}";
            
            var cachedProducts = _cacheService.Get<IEnumerable<Product>>(cacheKey);
            if (cachedProducts != null)
            {
                return cachedProducts;
            }

            var products = await _unitOfWork.Products.SearchProductsAsync(query);
            _cacheService.Set(cacheKey, products, TimeSpan.FromMinutes(10));
            
            return products;
        }        public async Task<Product> CreateProductAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            
            // Clear cache after adding a new product
            _cacheService.Clear();
            
            return result;
        }        public async Task<Product> UpdateProductAsync(Product product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.CompleteAsync();
            
            // Clear cache after updating a product
            _cacheService.Clear();
            
            return result;
        }        public async Task DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product != null)
            {
                await _unitOfWork.Products.DeleteAsync(product);
                await _unitOfWork.CompleteAsync();
                
                // Clear cache after deleting a product
                _cacheService.Clear();
            }
        }
    }
}
