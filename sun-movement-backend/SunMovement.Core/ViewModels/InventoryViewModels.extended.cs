using System;
using System.Collections.Generic;

namespace SunMovement.Core.ViewModels
{
    public class TopSellingProductViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public int UnitsSold { get; set; }
        public int ReorderPoint { get; set; }
    }

    public class LowStockItemViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int ReorderPoint { get; set; }
        public int EstimatedDaysUntilOutOfStock { get; set; }
    }

    public class InventoryTransactionViewModel
    {
        public int TransactionId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string TransactionType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionBy { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    // Extended properties for the InventoryInsightsViewModel
    public partial class InventoryInsightsViewModel
    {
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public int TotalProducts { get; set; }
        public decimal TotalValue { get; set; }
        public int LowStockProducts { get; set; }
        public int OutOfStockProducts { get; set; }
        public int TotalInventoryItems { get; set; }
        
        public List<TopSellingProductViewModel> TopSellingProducts { get; set; } = new List<TopSellingProductViewModel>();
        public List<LowStockItemViewModel> LowStockItems { get; set; } = new List<LowStockItemViewModel>();
        public List<InventoryTransactionViewModel> RecentTransactions { get; set; } = new List<InventoryTransactionViewModel>();
    }
}
