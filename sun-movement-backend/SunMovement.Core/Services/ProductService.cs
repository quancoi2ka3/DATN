using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _unitOfWork.Products.GetAllAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _unitOfWork.Products.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            try
            {
                var products = await _unitOfWork.Products.GetProductsByCategoryAsync(category);
                return products ?? Enumerable.Empty<Product>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ProductService.GetProductsByCategoryAsync: {ex.Message}");
                throw new Exception($"Failed to retrieve products for category {category}", ex);
            }
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            return await _unitOfWork.Products.GetFeaturedProductsAsync();
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            try
            {
                var searchQuery = string.IsNullOrEmpty(query) ? string.Empty : query;
                return await _unitOfWork.Products.SearchProductsAsync(searchQuery);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchProductsAsync: {ex.Message}");
                return Enumerable.Empty<Product>();
            }
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            return result;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            var result = await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.CompleteAsync();
            return result;
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product != null)
            {
                await _unitOfWork.Products.DeleteAsync(product);
                await _unitOfWork.CompleteAsync();
            }
        }
    }
}
