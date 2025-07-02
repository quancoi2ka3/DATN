using System;
using System.Collections.Generic;
using SunMovement.Core.Models;

namespace SunMovement.Core.ViewModels
{
    public partial class InventoryInsightsViewModel
    {
        public Models.InventoryMetrics InventoryMetrics { get; set; } = new Models.InventoryMetrics();
        public List<LowStockAlert> LowStockAlerts { get; set; } = new List<LowStockAlert>();
        public List<ProductReorderSuggestion> ReorderSuggestions { get; set; } = new List<ProductReorderSuggestion>();
        
        // Additional helper properties
        public int TotalProductsCount => InventoryMetrics.ProductsInStock + InventoryMetrics.ProductsOutOfStock;
        public decimal StockCoverage => InventoryMetrics.AverageDaysInInventory;
        public decimal OutOfStockPercentage => TotalProductsCount > 0 
            ? (decimal)InventoryMetrics.ProductsOutOfStock / TotalProductsCount * 100 
            : 0;
        public decimal LowStockPercentage => TotalProductsCount > 0 
            ? (decimal)InventoryMetrics.ProductsLowStock / TotalProductsCount * 100 
            : 0;
    }

    /// <summary>
    /// Cảnh báo sản phẩm có tồn kho thấp
    /// </summary>
    public class LowStockAlert
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string SKU { get; set; } = "";
        public int CurrentStock { get; set; }
        public int MinimumStockLevel { get; set; }
        public int ReorderPoint { get; set; }
        public bool IsOutOfStock => CurrentStock == 0;
        public string StockStatus => CurrentStock == 0 ? "Hết hàng" : 
                                    CurrentStock <= MinimumStockLevel ? "Sắp hết" : "Bình thường";
        public DateTime LastRestock { get; set; }
    }

    /// <summary>
    /// Đề xuất đặt lại hàng
    /// </summary>
    public class ProductReorderSuggestion
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string SKU { get; set; } = "";
        public int CurrentStock { get; set; }
        public int SuggestedReorderQuantity { get; set; }
        public decimal EstimatedCost { get; set; }
        public DateTime OptimalReorderDate { get; set; }
        public double AverageDailySales { get; set; }
        public int DaysUntilStockout { get; set; }
        public string Priority => DaysUntilStockout <= 7 ? "Cao" : 
                                 DaysUntilStockout <= 14 ? "Trung bình" : "Thấp";
    }
}
