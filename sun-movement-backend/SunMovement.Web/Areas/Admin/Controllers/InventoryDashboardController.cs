using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Services;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class InventoryDashboardController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInventoryService _inventoryService;
        private readonly ICouponService _couponService;
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<InventoryDashboardController> _logger;

        public InventoryDashboardController(
            IUnitOfWork unitOfWork,
            IInventoryService inventoryService,
            ICouponService couponService,
            IAnalyticsService analyticsService,
            ILogger<InventoryDashboardController> logger)
        {
            _unitOfWork = unitOfWork;
            _inventoryService = inventoryService;
            _couponService = couponService;
            _analyticsService = analyticsService;
            _logger = logger;
        }

        // GET: Admin/InventoryDashboard
        public async Task<IActionResult> Index()
        {
            try
            {
                var dashboardData = await GetDashboardDataAsync();
                return View(dashboardData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading inventory dashboard");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải dashboard kho hàng.";
                return View(new InventoryDashboardViewModel());
            }
        }

        // GET: Admin/InventoryDashboard/GetStockAlerts
        [HttpGet]
        public async Task<IActionResult> GetStockAlerts()
        {
            try
            {
                var lowStockProducts = await _inventoryService.GetLowStockProductsAsync();
                var outOfStockProducts = await _inventoryService.GetOutOfStockProductsAsync();
                
                var alerts = new
                {
                    LowStock = lowStockProducts,
                    OutOfStock = outOfStockProducts
                };
                
                return Json(new { success = true, data = alerts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stock alerts");
                return Json(new { success = false, message = "Có lỗi xảy ra khi tải cảnh báo tồn kho." });
            }
        }

        // GET: Admin/InventoryDashboard/GetInventoryTrends
        [HttpGet]
        public async Task<IActionResult> GetInventoryTrends(int days = 30)
        {
            try
            {
                var recentTransactions = await _inventoryService.GetRecentTransactionsAsync(days);
                var trends = new { transactions = recentTransactions, days = days };
                return Json(new { success = true, data = trends });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting inventory trends");
                return Json(new { success = false, message = "Có lỗi xảy ra khi tải xu hướng kho hàng." });
            }
        }

        // GET: Admin/InventoryDashboard/GetTopProducts
        [HttpGet]
        public async Task<IActionResult> GetTopProducts(int count = 10)
        {
            try
            {
                // Get top selling products from analytics service with real data
                var from = DateTime.Now.AddDays(-30);
                var to = DateTime.Now;
                var topSellingProducts = await _analyticsService.GetTopSellingProductsAsync(count, from, to);
                
                // Get product details for the top selling products
                var productIds = topSellingProducts.Select(t => t.ProductId).ToList();
                var products = await _unitOfWork.Products.FindAsync(p => productIds.Contains(p.Id));
                
                var result = products.Select(p => new { 
                    p.Id, 
                    p.Name, 
                    p.StockQuantity, 
                    QuantitySold = topSellingProducts.FirstOrDefault(t => t.ProductId == p.Id)?.QuantitySold ?? 0 
                });
                
                return Json(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top products");
                return Json(new { success = false, message = "Có lỗi xảy ra khi tải sản phẩm hàng đầu." });
            }
        }

        // GET: Admin/InventoryDashboard/GetCouponPerformance
        [HttpGet]
        public async Task<IActionResult> GetCouponPerformance()
        {
            try
            {
                var coupons = await _unitOfWork.Coupons.GetAllAsync();
                var performance = new
                {
                    TotalCoupons = coupons.Count(),
                    ActiveCoupons = coupons.Count(c => c.IsActive),
                    ExpiredCoupons = coupons.Count(c => c.IsExpired)
                };
                return Json(new { success = true, data = performance });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting coupon performance");
                return Json(new { success = false, message = "Có lỗi xảy ra khi tải hiệu suất mã giảm giá." });
            }
        }

        // GET: Admin/InventoryDashboard/ExportInventoryReport
        public async Task<IActionResult> ExportInventoryReport(DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                fromDate ??= DateTime.Now.AddMonths(-1);
                toDate ??= DateTime.Now;

                var products = await _unitOfWork.Products.GetAllAsync();
                var transactions = await _unitOfWork.InventoryTransactions.GetAllAsync();
                
                var reportData = new
                {
                    Products = products,
                    Transactions = transactions.Where(t => t.TransactionDate >= fromDate && t.TransactionDate <= toDate),
                    FromDate = fromDate,
                    ToDate = toDate
                };
                
                return Json(new { success = true, data = reportData });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting inventory report");
                return Json(new { success = false, message = "Có lỗi xảy ra khi xuất báo cáo kho hàng." });
            }
        }

        // Private Methods
        private async Task<InventoryDashboardViewModel> GetDashboardDataAsync()
        {
            var dashboardData = new InventoryDashboardViewModel();

            // Get basic statistics
            var products = await _unitOfWork.Products.GetAllAsync();
            var suppliers = await _unitOfWork.Suppliers.GetAllAsync();
            var coupons = await _unitOfWork.Coupons.GetAllAsync();
            var transactions = await _unitOfWork.InventoryTransactions.GetAllAsync();
            var recentTransactions = transactions.OrderByDescending(t => t.TransactionDate).Take(30);

            dashboardData.TotalProducts = products.Count();
            dashboardData.TotalSuppliers = suppliers.Count();
            dashboardData.ActiveCoupons = coupons.Count(c => c.IsActive && c.EndDate > DateTime.Now);
            dashboardData.RecentTransactions = recentTransactions.Count();

            // Calculate inventory value using correct property name
            dashboardData.TotalInventoryValue = products.Sum(p => p.StockQuantity * p.CostPrice);

            // Get low stock products
            var lowStockProducts = await _inventoryService.GetLowStockProductsAsync();
            dashboardData.LowStockProducts = lowStockProducts.Select(p => new { p.Id, p.Name, p.StockQuantity, p.MinimumStockLevel }).ToList<dynamic>();
            dashboardData.LowStockCount = lowStockProducts.Count();
            
            // Get out of stock products
            var outOfStockProducts = await _inventoryService.GetOutOfStockProductsAsync();
            dashboardData.OutOfStockProducts = outOfStockProducts.Select(p => new { p.Id, p.Name, p.StockQuantity }).ToList<dynamic>();
            dashboardData.OutOfStockCount = outOfStockProducts.Count();
            
            // Get aged inventory products
            var agedInventoryProducts = await _inventoryService.GetAgedInventoryAsync(90); // 90 ngày
            dashboardData.AgedInventoryProducts = agedInventoryProducts.Select(p => new { 
                p.Id, 
                p.Name, 
                p.StockQuantity, 
                p.LastStockUpdateDate,
                DaysInStock = (DateTime.Now - p.LastStockUpdateDate).TotalDays
            }).ToList<dynamic>();
            dashboardData.AgedInventoryCount = agedInventoryProducts.Count();

            // Get recent transactions
            dashboardData.RecentTransactionsList = recentTransactions.Take(10)
                .Select(t => new { t.Id, t.TransactionDate, t.TransactionType, t.Quantity, t.Notes })
                .ToList<dynamic>();

            // Get suppliers data
            var supplierData = suppliers.Where(s => s.IsActive).Take(5)
                .Select(s => new { s.Id, s.Name, s.ContactPerson, s.Email })
                .ToList();
            dashboardData.TopSuppliers = supplierData.ToList<dynamic>();

            // Get basic profit data
            var totalValue = await _inventoryService.GetTotalInventoryValueAsync();
            dashboardData.MonthlyProfitData = new { TotalValue = totalValue, Date = DateTime.Now };

            return dashboardData;
        }
    }

    // ViewModel for Dashboard
    public class InventoryDashboardViewModel
    {
        public int TotalProducts { get; set; }
        public int TotalSuppliers { get; set; }
        public int ActiveCoupons { get; set; }
        public int RecentTransactions { get; set; }
        public decimal TotalInventoryValue { get; set; }
        public int LowStockCount { get; set; }
        public int AgedInventoryCount { get; set; } // Số lượng sản phẩm tồn kho lâu
        public int OutOfStockCount { get; set; } // Số lượng sản phẩm hết hàng
        public List<dynamic> LowStockProducts { get; set; } = new();
        public List<dynamic> AgedInventoryProducts { get; set; } = new(); // Danh sách sản phẩm tồn kho lâu
        public List<dynamic> OutOfStockProducts { get; set; } = new(); // Danh sách sản phẩm hết hàng
        public List<dynamic> RecentTransactionsList { get; set; } = new();
        public List<dynamic> TopSuppliers { get; set; } = new();
        public dynamic? MonthlyProfitData { get; set; }
    }
}
