using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            return await _dbSet
                .Where(p => p.IsActive && p.IsFeatured)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category)
        {
            try
            {
                return await _dbSet
                    .Where(p => p.IsActive && p.Category == category)
                    .OrderBy(p => p.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in GetProductsByCategoryAsync: {ex.Message}");
                throw new Exception($"Failed to retrieve products for category {category}: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            return await _dbSet
                .Where(p => p.IsActive && 
                    (p.Name.Contains(query) || 
                    p.Description.Contains(query) || 
                    p.SubCategory.Contains(query)))
                .OrderBy(p => p.Name)
                .ToListAsync();
        }
    }
}
