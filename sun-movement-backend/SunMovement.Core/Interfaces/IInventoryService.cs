using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface IInventoryService
    {
        // Quản lý nhập xuất kho
        Task<InventoryTransaction> AddStockAsync(int productId, int quantity, decimal unitCost, int? supplierId = null, string referenceNumber = "", string notes = "");
        Task<InventoryTransaction> ReduceStockAsync(int productId, int quantity, string referenceNumber = "", string notes = "");
        Task<InventoryTransaction> AdjustStockAsync(int productId, int newQuantity, string reason = "");
        Task<InventoryTransaction> ProcessReturnAsync(int productId, int quantity, int? orderId = null, string notes = "");
        Task<bool> AdjustStockAfterOrderAsync(int orderId); // Phương thức mới để điều chỉnh kho sau khi có đơn hàng
        
        // Thêm các phương thức đang bị thiếu
        Task<dynamic> RecordStockOutAsync(int productId, int quantity, string notes = "");
        Task<dynamic> RecordStockAdjustmentAsync(int productId, int quantity, string notes = "");
        Task<IEnumerable<dynamic>> GetReorderSuggestionsAsync();
        Task<dynamic> CalculateProfitAsync(DateTime fromDate, DateTime toDate);
        
        // Thông tin kho hàng
        Task<IEnumerable<InventoryTransaction>> GetProductTransactionHistoryAsync(int productId);
        Task<IEnumerable<Product>> GetLowStockProductsAsync();
        Task<IEnumerable<Product>> GetOverstockProductsAsync();
        Task<IEnumerable<Product>> GetAgedInventoryAsync(int daysThreshold = 90);
        Task<IEnumerable<Product>> GetOutOfStockProductsAsync();
        
        // Thống kê và báo cáo
        Task<decimal> GetTotalInventoryValueAsync();
        Task<Dictionary<string, decimal>> GetInventoryValueByCategoryAsync();
        Task<decimal> GetProductProfitMarginAsync(int productId);
        Task<decimal> GetAverageProfitMarginAsync();
        Task<IEnumerable<InventoryTransaction>> GetRecentTransactionsAsync(int count = 10);
        
        // Cảnh báo và đề xuất
        Task<IEnumerable<Product>> GetProductsNeedingReorderAsync();
        Task<bool> ShouldReorderProductAsync(int productId);
        Task<int> CalculateOptimalOrderQuantityAsync(int productId);
        
        // Cập nhật thông tin kho
        Task UpdateLastStockDateAsync(int productId);
        Task RecalculateAverageCostAsync(int productId);
        
        // New methods for product-inventory integration
        Task<IEnumerable<InventoryItem>> GetAvailableInventoryItemsAsync();
        Task<InventoryItem> GetInventoryItemDetailsAsync(int id);
        Task<bool> TransferInventoryToProductAsync(int inventoryItemId, int productId, int quantity);
        Task<bool> CanCreateProductFromInventoryAsync(int inventoryItemId, int requiredQuantity = 1);
        Task<InventoryTransaction> CreateProductFromInventoryTransactionAsync(int inventoryItemId, int productId, int quantity, string notes = "");
    }
}
