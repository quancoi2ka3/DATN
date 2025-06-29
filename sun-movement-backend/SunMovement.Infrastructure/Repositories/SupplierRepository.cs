using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Repositories
{
    public class SupplierRepository : Repository<Supplier>, ISupplierRepository
    {
        public SupplierRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Supplier>> GetActiveAsync()
        {
            return await _context.Suppliers
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<Supplier?> GetByNameAsync(string name)
        {
            return await _context.Suppliers
                .FirstOrDefaultAsync(s => s.Name == name);
        }

        public async Task<Supplier?> GetSupplierWithProductsAsync(int supplierId)
        {
            return await _context.Suppliers
                .Include(s => s.ProductSuppliers)
                .ThenInclude(ps => ps.Product)
                .FirstOrDefaultAsync(s => s.Id == supplierId);
        }

        public async Task<IEnumerable<Product>> GetProductsBySupplierAsync(int supplierId)
        {
            return await _context.ProductSuppliers
                .Where(ps => ps.SupplierId == supplierId)
                .Select(ps => ps.Product!)
                .ToListAsync();
        }

        public async Task<bool> HasActiveProductsAsync(int supplierId)
        {
            return await _context.ProductSuppliers
                .AnyAsync(ps => ps.SupplierId == supplierId && ps.Product!.IsActive);
        }
    }
}
