using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using SunMovement.Core.DTOs;

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

        public async Task UpdateProductAsync(Product product, List<ProductSizeDto> sizes)
        {
            // Remove sizes not in the new list
            var existingSizes = _context.ProductSizes.Where(s => s.ProductId == product.Id).ToList();
            foreach (var size in existingSizes)
            {
                if (!sizes.Any(s => s.Id == size.Id))
                    _context.ProductSizes.Remove(size);
            }

            // Add or update sizes
            foreach (var sizeDto in sizes)
            {
                var existing = existingSizes.FirstOrDefault(s => s.Id == sizeDto.Id);
                if (existing != null)
                {
                    existing.SizeLabel = sizeDto.SizeLabel;
                    existing.StockQuantity = sizeDto.StockQuantity;
                }
                else
                {
                    _context.ProductSizes.Add(new ProductSize
                    {
                        ProductId = product.Id,
                        SizeLabel = sizeDto.SizeLabel,
                        StockQuantity = sizeDto.StockQuantity
                    });
                }
            }

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
    }
}
