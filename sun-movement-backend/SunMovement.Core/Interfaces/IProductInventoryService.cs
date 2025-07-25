using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    /// <summary>
    /// Service để quản lý tích hợp giữa sản phẩm và kho hàng
    /// </summary>
    public interface IProductInventoryService
    {
        /// <summary>
        /// Tạo sản phẩm và tùy chọn nhập kho ban đầu
        /// </summary>
        Task<Product> CreateProductWithInventoryAsync(
            Product product, 
            int initialQuantity = 0, 
            decimal? unitCost = null, 
            int? supplierId = null, 
            string referenceNumber = "", 
            string notes = "");

        /// <summary>
        /// Cập nhật trạng thái sản phẩm dựa trên tồn kho
        /// </summary>
        Task UpdateProductStatusBasedOnInventoryAsync(int productId);

        /// <summary>
        /// Cập nhật trạng thái cho tất cả các sản phẩm dựa trên tồn kho
        /// </summary>
        Task UpdateAllProductStatusesBasedOnInventoryAsync();

        /// <summary>
        /// Lấy thông tin sản phẩm và kho hàng
        /// </summary>
        Task<ProductWithInventoryViewModel> GetProductWithInventoryAsync(int productId);

        /// <summary>
        /// Lấy danh sách sản phẩm với thông tin kho hàng
        /// </summary>
        Task<IEnumerable<ProductWithInventoryViewModel>> GetAllProductsWithInventoryAsync();

        /// <summary>
        /// Đồng bộ hóa thông tin tồn kho và trạng thái sản phẩm
        /// </summary>
        Task SyncProductWithInventoryAsync(int productId);

        /// <summary>
        /// Cập nhật thông tin tồn kho cho nhiều sản phẩm cùng lúc
        /// </summary>
        Task BatchUpdateInventoryAsync(List<InventoryUpdateItem> updates);

        /// <summary>
        /// Tính toán giá vốn mới dựa trên phương pháp bình quân gia quyền
        /// </summary>
        Task<decimal> CalculateWeightedAverageCostAsync(int productId, int newQuantity, decimal newCost);

        /// <summary>
        /// Lấy danh sách sản phẩm cần nhập hàng
        /// </summary>
        Task<IEnumerable<ViewModels.ProductReorderSuggestion>> GetProductsForReorderAsync();
        
        /// <summary>
        /// Cảnh báo tồn kho thấp
        /// </summary>
        Task<IEnumerable<ViewModels.LowStockAlert>> GetLowStockAlertsAsync();

        /// <summary>
        /// Đồng bộ tồn kho từ các biến thể sản phẩm với sản phẩm chính
        /// </summary>
        Task SyncProductStockFromVariantsAsync(int productId);

        /// <summary>
        /// Xóa sản phẩm và tất cả dữ liệu kho hàng liên quan
        /// </summary>
        Task<bool> DeleteProductWithInventoryAsync(int productId);
    }

    public class InventoryUpdateItem
    {
        public int ProductId { get; set; }
        public int NewQuantity { get; set; }
        public decimal? NewCostPrice { get; set; }
        public string Reason { get; set; } = "";
    }

    // Classes moved to SunMovement.Core.ViewModels namespace
}
