using System;
using System.Collections.Generic;
using SunMovement.Core.Models;

namespace SunMovement.Core.ViewModels
{
    public class ProductWithInventoryViewModel
    {
        public Product? Product { get; set; }
        public List<InventoryTransaction> InventoryTransactions { get; set; }
        public List<Coupon> AppliedCoupons { get; set; }
        public int CurrentStock { get; set; }
        public decimal TotalCost { get; set; }
        public int ReorderPoint { get; set; }
        public DateTime? LastRestock { get; set; }
        
        // Thêm các thuộc tính mới cho quản lý kho hàng tốt hơn
        public decimal AverageCostPrice { get; set; }
        public decimal TotalInventoryValue => CurrentStock * AverageCostPrice;
        public int OptimalStockLevel { get; set; }
        public bool IsLowStock => CurrentStock <= ReorderPoint && CurrentStock > 0;
        public bool IsOutOfStock => CurrentStock <= 0;
        public int SuggestedReorderQuantity { get; set; }
        public int DaysInStock { get; set; }
        public double AverageDailySales { get; set; }
        public int EstimatedDaysToOutOfStock { get; set; }
        
        // Thêm thông tin về hiệu suất bán hàng từ Mixpanel
        public int ViewCount { get; set; }
        public int CartAddCount { get; set; }
        public int PurchaseCount { get; set; }
        public decimal ConversionRate { get; set; }
        
        // Thêm thông tin về biến thể sản phẩm
        public List<ProductVariantInventory> Variants { get; set; }
        
        public ProductWithInventoryViewModel()
        {
            InventoryTransactions = new List<InventoryTransaction>();
            AppliedCoupons = new List<Coupon>();
            Variants = new List<ProductVariantInventory>();
        }
    }
    
    public class ProductVariantInventory
    {
        public ProductVariant? Variant { get; set; }
        public int CurrentStock { get; set; }
        public decimal CostPrice { get; set; }
        public bool IsLowStock { get; set; }
        public bool IsOutOfStock { get; set; }
        public DateTime? LastRestockDate { get; set; }
    }
}
