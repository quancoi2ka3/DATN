using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    /// <summary>
    /// Service để quản lý phân tích dữ liệu từ Mixpanel
    /// </summary>
    public interface IAnalyticsService
    {
        /// <summary>
        /// Get inventory insights with more detailed analysis
        /// </summary>
        Task<Core.ViewModels.InventoryInsightsViewModel> GetInventoryInsightsAsync();
        
        /// <summary>
        /// Lấy số liệu thống kê tổng quan cho trang Dashboard
        /// </summary>
        Task<DashboardMetrics> GetDashboardMetricsAsync(DateTime from, DateTime to);

        /// <summary>
        /// Lấy thông tin phân tích cho sản phẩm
        /// </summary>
        Task<ProductMetrics> GetProductMetricsAsync(int productId, DateTime from, DateTime to);

        /// <summary>
        /// Lấy thông tin phân tích cho kho hàng
        /// </summary>
        Task<InventoryMetrics> GetInventoryMetricsAsync(DateTime from, DateTime to);

        /// <summary>
        /// Lấy thông tin phân tích cho mã giảm giá
        /// </summary>
        Task<CouponMetrics> GetCouponMetricsAsync(int? couponId = null, DateTime? from = null, DateTime? to = null);

        /// <summary>
        /// Lấy thông tin dự báo tồn kho
        /// </summary>
        Task<InventoryForecast> GetInventoryForecastAsync();

        /// <summary>
        /// Lấy thông tin phân tích hiệu quả mã giảm giá
        /// </summary>
        Task<CouponAnalytics> GetCouponAnalyticsAsync(DateTime from, DateTime to);
        
        /// <summary>
        /// Lấy dữ liệu sản phẩm bán chạy
        /// </summary>
        Task<IEnumerable<TopSellingProduct>> GetTopSellingProductsAsync(int count = 10, DateTime? from = null, DateTime? to = null);

        /// <summary>
        /// Lấy dữ liệu khách hàng thân thiết
        /// </summary>
        Task<IEnumerable<TopCustomer>> GetTopCustomersAsync(int count = 10, DateTime? from = null, DateTime? to = null);
        
        /// <summary>
        /// Lấy dữ liệu xu hướng bán hàng theo thời gian
        /// </summary>
        Task<SalesTrend> GetSalesTrendAsync(string period = "day", int days = 30);

        /// <summary>
        /// Lấy danh sách từ khóa tìm kiếm phổ biến từ Mixpanel
        /// </summary>
        Task<List<Core.ViewModels.SearchQueryAnalytics>> GetTopSearchQueriesAsync(int limit = 10);
    }

    public class DashboardMetrics
    {
        public decimal TotalSales { get; set; }
        public int TotalOrders { get; set; }
        public int TotalVisits { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal ConversionRate { get; set; }
        public int NewCustomers { get; set; }
        public int ReturningCustomers { get; set; }
        public Dictionary<string, int> OrdersByStatus { get; set; } = new();
        public Dictionary<string, decimal> SalesByCategory { get; set; } = new();
        public int ProductsOutOfStock { get; set; }
        public int ProductsLowStock { get; set; }
        public Dictionary<string, int> VisitsBySource { get; set; } = new();
    }

    public class ProductMetrics
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public int TotalViews { get; set; }
        public int AddToCarts { get; set; }
        public int Purchases { get; set; }
        public decimal ConversionRate { get; set; }
        public decimal AbandonmentRate { get; set; }
        public Dictionary<string, int> ViewsByDevice { get; set; } = new();
        public Dictionary<string, int> ViewsBySource { get; set; } = new();
        public Dictionary<DateTime, int> ViewsOverTime { get; set; } = new();
        public Dictionary<DateTime, int> SalesOverTime { get; set; } = new();
    }

    public class InventoryMetrics
    {
        public decimal TotalInventoryValue { get; set; }
        public int ProductsInStock { get; set; }
        public int ProductsOutOfStock { get; set; }
        public int ProductsLowStock { get; set; }
        public decimal AverageDaysInInventory { get; set; }
        public Dictionary<string, decimal> InventoryValueByCategory { get; set; } = new();
        public Dictionary<string, int> StockLevelsByCategory { get; set; } = new();
        public int TotalStockIn { get; set; }
        public int TotalStockOut { get; set; }
        public decimal TotalCostOfGoodsSold { get; set; }
    }

    public class CouponMetrics
    {
        public int TotalCouponsUsed { get; set; }
        public decimal TotalDiscountAmount { get; set; }
        public decimal AverageDiscountPerOrder { get; set; }
        public Dictionary<string, int> UsageByCode { get; set; } = new();
        public Dictionary<string, decimal> DiscountByCode { get; set; } = new();
        public Dictionary<DateTime, int> UsageOverTime { get; set; } = new();
        public int AverageDailyUsage { get; set; }
        public int ActiveCoupons { get; set; }
        public int ExpiredCoupons { get; set; }
    }

    public class InventoryForecast
    {
        public List<ProductForecast> Products { get; set; } = new();
        public DateTime GeneratedAt { get; set; }
    }

    public class ProductForecast
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string SKU { get; set; } = "";
        public int CurrentStock { get; set; }
        public double DailySalesRate { get; set; }
        public int DaysUntilOutOfStock { get; set; }
        public string StockStatus { get; set; } = ""; // "Healthy", "Warning", "Critical"
        public int ReorderQuantity { get; set; }
        public decimal EstimatedReorderCost { get; set; }
    }

    public class CouponAnalytics
    {
        public List<CouponStats> Coupons { get; set; } = new();
        public int TotalUsage { get; set; }
        public decimal TotalDiscountAmount { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class CouponStats
    {
        public int CouponId { get; set; }
        public string CouponCode { get; set; } = "";
        public int UsageCount { get; set; }
        public decimal TotalDiscountAmount { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal ConversionRate { get; set; }
        public Dictionary<DateTime, int> UsageByDay { get; set; } = new();
    }

    public class TopSellingProduct
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string SKU { get; set; } = "";
        public int QuantitySold { get; set; }
        public decimal Revenue { get; set; }
        public decimal Profit { get; set; }
        public int Views { get; set; }
        public decimal ConversionRate { get; set; }
    }

    public class TopCustomer
    {
        public string CustomerId { get; set; } = "";
        public string CustomerName { get; set; } = "";
        public string Email { get; set; } = "";
        public int OrderCount { get; set; }
        public decimal TotalSpent { get; set; }
        public DateTime FirstPurchase { get; set; }
        public DateTime LastPurchase { get; set; }
        public bool HasUsedCoupons { get; set; }
        public decimal AverageOrderValue { get; set; }
    }

    public class SalesTrend
    {
        public Dictionary<DateTime, decimal> Revenue { get; set; } = new();
        public Dictionary<DateTime, int> Orders { get; set; } = new();
        public Dictionary<DateTime, decimal> AverageOrderValue { get; set; } = new();
        public Dictionary<string, Dictionary<DateTime, decimal>> RevenueByCategory { get; set; } = new();
    }
}
