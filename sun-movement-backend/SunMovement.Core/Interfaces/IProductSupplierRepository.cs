using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface IProductSupplierRepository : IRepository<ProductSupplier>
    {
        Task<IEnumerable<Product>> GetProductsBySupplierIdAsync(int supplierId);
        Task<IEnumerable<Supplier>> GetSuppliersByProductIdAsync(int productId);
        Task<bool> HasProductsAsync(int supplierId);
        Task<bool> HasSuppliersAsync(int productId);
        Task<ProductSupplier?> GetProductSupplierAsync(int productId, int supplierId);
    }
}
