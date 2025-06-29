using System.Collections.Generic;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Admin.Models
{
    public class IntegratedSystemViewModel
    {
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalInventoryValue { get; set; }
        
        public IEnumerable<Product> LowStockProducts { get; set; } = new List<Product>();
        public IEnumerable<Product> OutOfStockProducts { get; set; } = new List<Product>();
        public IEnumerable<Coupon> ActiveCoupons { get; set; } = new List<Coupon>();
        
        // Thống kê
        public int LowStockCount => LowStockProducts?.Count() ?? 0;
        public int OutOfStockCount => OutOfStockProducts?.Count() ?? 0;
        public int ActiveCouponCount => ActiveCoupons?.Count() ?? 0;
    }
    
    public class ProductCouponMappingViewModel
    {
        public List<Product> Products { get; set; } = new List<Product>();
        public List<Coupon> Coupons { get; set; } = new List<Coupon>();
    }
}
