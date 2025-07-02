using System;
using System.Collections.Generic;
using SunMovement.Core.Models;
using SunMovement.Core.Interfaces;

namespace SunMovement.Core.ViewModels
{
    /// <summary>
    /// Lớp chứa thông tin metrics cho kho hàng
    /// </summary>
    public class CouponAnalyticsViewModel
    {
        public CouponAnalytics CouponAnalytics { get; set; } = new CouponAnalytics();
        public CouponMetrics? SpecificCouponMetrics { get; set; }
        public Coupon? SpecificCoupon { get; set; }
        public List<Coupon> AvailableCoupons { get; set; } = new List<Coupon>();
    }
    
    /// <summary>
    /// Lớp chứa thông tin cho batch update kho hàng
    /// </summary>
    public class BatchInventoryUpdateViewModel
    {
        public List<Product> Products { get; set; } = new List<Product>();
        public List<InventoryUpdateItem> Updates { get; set; } = new List<InventoryUpdateItem>();
        public string UpdateReason { get; set; }
        public bool NotifyLowStock { get; set; }
        public bool UpdateAllProducts { get; set; }
        
        public BatchInventoryUpdateViewModel()
        {
            UpdateReason = "";
            NotifyLowStock = true;
            UpdateAllProducts = false;
        }
    }
    
    /// <summary>
    /// Lớp chứa thông tin cho một sản phẩm trong batch update kho hàng
    /// </summary>
    public class ProductInventoryBatchUpdate
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string SKU { get; set; }
        public int CurrentStock { get; set; }
        public int NewStock { get; set; }
        public decimal? NewCostPrice { get; set; }
        public bool IsLowStock { get; set; }
        public bool IsSelected { get; set; }
        
        public ProductInventoryBatchUpdate()
        {
            ProductName = "";
            SKU = "";
            IsSelected = false;
        }
    }
}
