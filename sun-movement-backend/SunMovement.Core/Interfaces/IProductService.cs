using System.Collections.Generic;
using System.Threading.Tasks;
using SunMovement.Core.Models;

namespace SunMovement.Core.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product> GetProductByIdAsync(int id);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(ProductCategory category);
        Task<IEnumerable<Product>> GetFeaturedProductsAsync();
        Task<IEnumerable<Product>> SearchProductsAsync(string query);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task DeleteProductAsync(int id);
        
        // New integrated methods
        Task<Product> CreateProductFromInventoryAsync(
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
            bool allowBackorder = false);
            
        Task ApplyCouponsToProductAsync(int productId, List<int> couponIds);
        Task RemoveCouponsFromProductAsync(int productId, List<int> couponIds);
        Task<IEnumerable<Coupon>> GetProductCouponsAsync(int productId);
        Task<IEnumerable<Product>> GetProductsWithLowStockAsync();
        Task<IEnumerable<Product>> GetProductsBySupplierAsync(int supplierId);
        Task UpdateProductStockAsync(int productId, int newQuantity, string reason);
        Task<decimal> CalculateProductProfitAsync(int productId);
        Task<IEnumerable<Product>> GetProductsCreatedFromInventoryAsync(int inventoryItemId);
    }
}
