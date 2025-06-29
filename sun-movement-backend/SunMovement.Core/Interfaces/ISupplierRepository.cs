using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<IEnumerable<Supplier>> GetActiveAsync();
        Task<Supplier?> GetByNameAsync(string name);
        Task<Supplier?> GetSupplierWithProductsAsync(int supplierId);
        Task<IEnumerable<Product>> GetProductsBySupplierAsync(int supplierId);
        Task<bool> HasActiveProductsAsync(int supplierId);
    }
}
