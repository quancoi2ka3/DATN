using SunMovement.Core.Models;
using System.Collections.Generic;

namespace SunMovement.Web.Areas.Admin.Models
{
    public class AdminDashboardViewModel
    {
        // Thống kê cơ bản
        public int ProductCount { get; set; }
        public int ServiceCount { get; set; }
        public int OrderCount { get; set; }
        public int EventCount { get; set; }
        public int FAQCount { get; set; }
        public int UnreadMessageCount { get; set; }
        public int TotalMessageCount { get; set; }
        public int UserCount { get; set; }
        
        // Doanh thu
        public decimal TodayRevenue { get; set; }
        public decimal WeekRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        
        // Đơn hàng mới nhất
        public IEnumerable<Order> RecentOrders { get; set; }
        public int PendingOrderCount { get; set; }
        
        // Sản phẩm - Kho hàng
        public IEnumerable<Product> LowStockProducts { get; set; }
        public IEnumerable<Product> TopSellingProducts { get; set; }
        public decimal TotalInventoryValue { get; set; }
        public int OutOfStockCount { get; set; }
        
        // Mã giảm giá
        public IEnumerable<Coupon> ActiveDiscounts { get; set; }
        public IEnumerable<Coupon> ExpiringDiscounts { get; set; }
        public int ActiveDiscountCount { get; set; }
        
        public AdminDashboardViewModel()
        {
            // Initialize collections to avoid null reference exceptions
            RecentOrders = new List<Order>();
            LowStockProducts = new List<Product>();
            TopSellingProducts = new List<Product>();
            ActiveDiscounts = new List<Coupon>();
            ExpiringDiscounts = new List<Coupon>();
        }
    }
}
