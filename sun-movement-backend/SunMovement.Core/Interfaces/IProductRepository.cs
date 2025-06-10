using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetFeaturedProductsAsync();
        
        /// <summary>
        /// Gets products filtered by category
        /// </summary>
        /// <param name="category">The product category to filter by</param>
        /// <returns>A collection of products in the specified category</returns>
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category);
        
        Task<IEnumerable<Product>> SearchProductsAsync(string query);
    }
}
