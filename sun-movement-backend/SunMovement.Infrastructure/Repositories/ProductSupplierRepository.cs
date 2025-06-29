using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Repositories
{
    public class ProductSupplierRepository : Repository<ProductSupplier>, IProductSupplierRepository
    {
        public ProductSupplierRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetProductsBySupplierIdAsync(int supplierId)
        {
            return await _context.ProductSuppliers
                .Where(ps => ps.SupplierId == supplierId)
                .Select(ps => ps.Product!)
                .ToListAsync();
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersByProductIdAsync(int productId)
        {
            return await _context.ProductSuppliers
                .Where(ps => ps.ProductId == productId)
                .Select(ps => ps.Supplier!)
                .ToListAsync();
        }

        public async Task<bool> HasProductsAsync(int supplierId)
        {
            return await _context.ProductSuppliers
                .AnyAsync(ps => ps.SupplierId == supplierId);
        }

        public async Task<bool> HasSuppliersAsync(int productId)
        {
            return await _context.ProductSuppliers
                .AnyAsync(ps => ps.ProductId == productId);
        }

        public async Task<ProductSupplier?> GetProductSupplierAsync(int productId, int supplierId)
        {
            return await _context.ProductSuppliers
                .FirstOrDefaultAsync(ps => ps.ProductId == productId && ps.SupplierId == supplierId);
        }
    }
}
