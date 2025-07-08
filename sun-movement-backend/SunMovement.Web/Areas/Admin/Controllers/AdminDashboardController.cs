using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using SunMovement.Web.Areas.Admin.Models;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    public class AdminDashboardController : BaseAdminController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IInventoryService _inventoryService;
        private readonly ICouponService _couponService;
        private readonly IProductService _productService;
        private readonly IProductInventoryService _productInventoryService;
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(
            IUnitOfWork unitOfWork, 
            UserManager<ApplicationUser> userManager,
            IInventoryService inventoryService,
            ICouponService couponService,
            IProductService productService,
            IProductInventoryService productInventoryService,
            IAnalyticsService analyticsService,
            ILogger<AdminDashboardController> logger)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _inventoryService = inventoryService;
            _couponService = couponService;
            _productService = productService;
            _productInventoryService = productInventoryService;
            _analyticsService = analyticsService;
            _logger = logger;
        }        public async Task<IActionResult> Index()
        {
            try
            {
                // Initialize view model
                var dashboardViewModel = new AdminDashboardViewModel();
                
                var today = DateTime.Today;
                var startOfMonth = new DateTime(today.Year, today.Month, 1);
                var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
                
                // Get analytics data from our new services
                var dashboardMetrics = await _analyticsService.GetDashboardMetricsAsync(
                    startOfMonth, 
                    today);
                
                // Get product inventory insights
                var lowStockAlerts = await _productInventoryService.GetLowStockAlertsAsync();
                // Extract product IDs here to avoid ambiguity issues
                var productIds = new List<int>();
                foreach (var alert in lowStockAlerts)
                {
                    // Use reflection to access ProductId to avoid ambiguity
                    var property = alert.GetType().GetProperty("ProductId");
                    if (property != null)
                    {
                        var productId = property.GetValue(alert);
                        if (productId != null)
                        {
                            productIds.Add(Convert.ToInt32(productId));
                        }
                    }
                }
                var reorderSuggestions = await _productInventoryService.GetProductsForReorderAsync();
                
                // Update dashboard with analytics data
                dashboardViewModel.ProductCount = await _unitOfWork.Products.CountAsync();
                dashboardViewModel.ServiceCount = await _unitOfWork.Services.CountAsync();
                dashboardViewModel.OrderCount = dashboardMetrics.TotalOrders;
                dashboardViewModel.UserCount = _userManager.Users.Count();
                
                // Calculate growth percentages
                var lastMonth = startOfMonth.AddMonths(-1);
                var lastMonthEnd = startOfMonth.AddDays(-1);
                
                // Calculate previous month metrics for comparison
                var lastMonthProducts = await _unitOfWork.Products.CountAsync(p => p.CreatedAt < startOfMonth);
                var lastMonthServices = await _unitOfWork.Services.CountAsync(s => s.CreatedAt < startOfMonth);
                var lastMonthOrders = await _unitOfWork.Orders.CountAsync(o => o.OrderDate >= lastMonth && o.OrderDate <= lastMonthEnd);
                var lastMonthUsers = _userManager.Users.Count(u => u.Id != null); // Fallback for users without CreatedDate
                
                // Calculate growth percentages
                ViewBag.ProductGrowthPercentage = CalculateGrowthPercentage(lastMonthProducts, dashboardViewModel.ProductCount);
                ViewBag.ServiceGrowthPercentage = CalculateGrowthPercentage(lastMonthServices, dashboardViewModel.ServiceCount);
                ViewBag.OrderGrowthPercentage = CalculateGrowthPercentage(lastMonthOrders, dashboardViewModel.OrderCount);
                ViewBag.UserGrowthPercentage = CalculateGrowthPercentage(lastMonthUsers, dashboardViewModel.UserCount);
                
                dashboardViewModel.TotalVisits = dashboardMetrics.TotalVisits;
                dashboardViewModel.ConversionRate = dashboardMetrics.ConversionRate;
                dashboardViewModel.AverageOrderValue = dashboardMetrics.AverageOrderValue;
                
                // Get customer statistics
                var allUsers = _userManager.Users.ToList();
                var totalCustomers = 0;
                var activeCustomers = 0;
                foreach (var user in allUsers)
                {
                    if (await _userManager.IsInRoleAsync(user, "Customer"))
                    {
                        totalCustomers++;
                        if (user.IsActive)
                        {
                            activeCustomers++;
                        }
                    }
                }
                
                dashboardViewModel.NewCustomers = dashboardMetrics.NewCustomers;
                dashboardViewModel.ReturningCustomers = dashboardMetrics.ReturningCustomers;
                
                // Get order statistics
                dashboardViewModel.PendingOrderCount = dashboardMetrics.OrdersByStatus.TryGetValue(
                    OrderStatus.Pending.ToString(), out int pendingCount) ? pendingCount : 0;
                    
                dashboardViewModel.UnreadMessageCount = await _unitOfWork.ContactMessages.CountAsync(m => !m.IsRead);
                dashboardViewModel.TotalMessageCount = await _unitOfWork.ContactMessages.CountAsync();
                
                // Get inventory statistics from our product inventory service
                // Get product information from low stock alerts using the productIds already collected
                var lowStockProducts = await _unitOfWork.Products.FindAsync(p => productIds.Contains(p.Id));
                dashboardViewModel.LowStockProducts = lowStockProducts.ToList();
                
                dashboardViewModel.OutOfStockCount = dashboardMetrics.ProductsOutOfStock;
                // Calculate total inventory value from inventory metrics
                var inventoryMetrics = await _analyticsService.GetInventoryMetricsAsync(startOfMonth, today);
                dashboardViewModel.TotalInventoryValue = inventoryMetrics.TotalInventoryValue;
                
                // Get recent orders (limit to 5)
                var recentOrders = await _unitOfWork.Orders.GetAllAsync();
                dashboardViewModel.RecentOrders = recentOrders
                    .OrderByDescending(o => o.OrderDate)
                    .Take(5)
                    .ToList();
                
                // Get top selling products from analytics service
                var topSellingProducts = await _analyticsService.GetTopSellingProductsAsync(5);
                var topProductIds = topSellingProducts.Select(t => t.ProductId).ToList();
                var topProducts = await _unitOfWork.Products.FindAsync(p => topProductIds.Contains(p.Id));
                dashboardViewModel.TopSellingProducts = topProducts.ToList();
                
                // Get active coupons
                var couponMetrics = await _analyticsService.GetCouponMetricsAsync();
                dashboardViewModel.ActiveDiscounts = await _couponService.GetAllActiveCouponsAsync();
                dashboardViewModel.ActiveDiscountCount = dashboardViewModel.ActiveDiscounts.Count();
                
                // Get expiring coupons
                var oneWeekLater = today.AddDays(7);
                var allCoupons = await _unitOfWork.Coupons.GetAllAsync();
                dashboardViewModel.ExpiringDiscounts = allCoupons
                    .Where(c => c.IsActive && c.EndDate <= oneWeekLater && c.EndDate >= today)
                    .ToList();
                    
                // Calculate revenue metrics
                try {
                    dashboardViewModel.TodayRevenue = await CalculateDailyRevenueAsync(today);
                    dashboardViewModel.WeekRevenue = await CalculateWeeklyRevenueAsync(today);
                    dashboardViewModel.MonthlyRevenue = await CalculateMonthlyRevenueAsync(today.Year, today.Month);
                }
                catch (Exception ex) {
                    // Log exception
                    _logger.LogError(ex, "Error calculating revenue metrics");
                    
                    // Set to 0 instead of random data when calculation fails
                    dashboardViewModel.TodayRevenue = 0;
                    dashboardViewModel.WeekRevenue = 0;
                    dashboardViewModel.MonthlyRevenue = 0;
                }
                
                // Set sales by category from dashboard metrics
                dashboardViewModel.SalesByCategory = dashboardMetrics.SalesByCategory;
                
                // Set visitors by source from dashboard metrics
                dashboardViewModel.VisitorsBySource = dashboardMetrics.VisitsBySource;
                
                // FAQs count
                dashboardViewModel.FAQCount = await _unitOfWork.FAQs.CountAsync();
                dashboardViewModel.EventCount = await _unitOfWork.Events.CountAsync();
                
                // Populate ViewBag for backward compatibility with existing view
                ViewBag.TotalProducts = dashboardViewModel.ProductCount;
                ViewBag.TotalServices = dashboardViewModel.ServiceCount;
                ViewBag.TotalOrders = dashboardViewModel.OrderCount;
                ViewBag.TotalUsers = dashboardViewModel.UserCount;
                ViewBag.PendingOrders = dashboardViewModel.PendingOrderCount;
                ViewBag.UnreadMessages = dashboardViewModel.UnreadMessageCount;
                ViewBag.LowStockItems = dashboardViewModel.LowStockProducts.Count();
                ViewBag.TodayRevenue = dashboardViewModel.TodayRevenue.ToString("N0");
                ViewBag.WeekRevenue = dashboardViewModel.WeekRevenue.ToString("N0");
                ViewBag.MonthlyRevenue = dashboardViewModel.MonthlyRevenue.ToString("N0");
                
                // Add missing ViewBag values that the view expects
                ViewBag.TodayPageViews = dashboardMetrics.TotalVisits > 0 ? dashboardMetrics.TotalVisits / 30 : 0;
                ViewBag.TodaySearches = 0; // Set to 0 instead of fake data - needs Mixpanel search tracking
                ViewBag.PendingPayments = dashboardViewModel.PendingOrderCount; // Use pending orders as pending payments
                
                // Add chart data for JavaScript
                ViewBag.RevenueChartData = System.Text.Json.JsonSerializer.Serialize(new
                {
                    labels = new[] { "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6" },
                    data = new[] { 0, 0, 0, 0, 0, (int)dashboardViewModel.MonthlyRevenue } // Real current month, others 0
                });
                
                ViewBag.SalesSourceData = System.Text.Json.JsonSerializer.Serialize(new
                {
                    labels = new[] { "Sản Phẩm", "Dịch Vụ" },
                    data = new[] { dashboardViewModel.ProductCount, dashboardViewModel.ServiceCount }
                });
                
                // Calculate order status percentages for progress bar
                var totalOrders = dashboardViewModel.OrderCount;
                if (totalOrders > 0)
                {
                    var completedOrders = dashboardMetrics.OrdersByStatus.GetValueOrDefault("Completed", 0);
                    var pendingOrders = dashboardMetrics.OrdersByStatus.GetValueOrDefault("Pending", 0);
                    var cancelledOrders = dashboardMetrics.OrdersByStatus.GetValueOrDefault("Cancelled", 0);
                    
                    ViewBag.CompletedPercentage = (int)Math.Round((double)completedOrders / totalOrders * 100);
                    ViewBag.PendingPercentage = (int)Math.Round((double)pendingOrders / totalOrders * 100);
                    ViewBag.CancelledPercentage = (int)Math.Round((double)cancelledOrders / totalOrders * 100);
                }
                else
                {
                    ViewBag.CompletedPercentage = 0;
                    ViewBag.PendingPercentage = 0;
                    ViewBag.CancelledPercentage = 0;
                }
                
                // Get real search analytics data from Mixpanel
                try
                {
                    var topSearchQueries = await _analyticsService.GetTopSearchQueriesAsync(5);
                    ViewBag.TopSearchQueries = topSearchQueries.Select(q => new
                    {
                        Query = q.Query,
                        Count = q.Count,
                        ResultCount = q.ResultCount ?? 0
                    }).ToList();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load search analytics data");
                    ViewBag.TopSearchQueries = new List<object>();
                }
                
                // Get real recent activities
                try
                {
                    var recentActivities = await GetRecentActivitiesAsync();
                    ViewBag.RecentActivities = recentActivities;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load recent activities");
                    ViewBag.RecentActivities = new List<Core.ViewModels.RecentActivity>();
                }
                
                // Get real notifications
                try
                {
                    var notifications = await GetNotificationsAsync();
                    ViewBag.Notifications = notifications;
                    ViewBag.NotificationCount = notifications.Count(n => !n.IsRead);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load notifications");
                    ViewBag.Notifications = new List<Core.ViewModels.AdminNotification>();
                    ViewBag.NotificationCount = 0;
                }
                
                // Get growth statistics
                try
                {
                    var growthStats = await GetGrowthStatisticsAsync();
                    ViewBag.GrowthStatistics = growthStats;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load growth statistics");
                    ViewBag.GrowthStatistics = new
                    {
                        ProductGrowth = 0m,
                        ServiceGrowth = 0m,
                        OrderGrowth = 0m,
                        RevenueGrowth = 0m
                    };
                }
                
                return View(dashboardViewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading dashboard data");
                TempData["ErrorMessage"] = "Có lỗi xảy ra khi tải dữ liệu bảng điều khiển.";
                
                // Return empty dashboard model
                return View(new AdminDashboardViewModel());
            }
        }
        
        private async Task<decimal> CalculateDailyRevenueAsync(DateTime date)
        {
            // Get completed orders for the specified day and sum their total amounts
            var orders = await _unitOfWork.Orders.FindAsync(
                o => o.OrderDate.Date == date.Date && o.Status == OrderStatus.Completed);
            
            return orders.Sum(o => o.TotalAmount);
        }
        
        private async Task<decimal> CalculateWeeklyRevenueAsync(DateTime endDate)
        {
            var startDate = endDate.AddDays(-6); // Last 7 days including today
            
            // Get completed orders for the date range and sum their total amounts
            var orders = await _unitOfWork.Orders.FindAsync(
                o => o.OrderDate.Date >= startDate.Date && 
                     o.OrderDate.Date <= endDate.Date && 
                     o.Status == OrderStatus.Completed);
            
            return orders.Sum(o => o.TotalAmount);
        }
        
        private async Task<decimal> CalculateMonthlyRevenueAsync(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            
            // Get completed orders for the specific month and sum their total amounts
            var orders = await _unitOfWork.Orders.FindAsync(
                o => o.OrderDate.Date >= startDate.Date && 
                     o.OrderDate.Date <= endDate.Date && 
                     o.Status == OrderStatus.Completed);
            
            return orders.Sum(o => o.TotalAmount);
        }
        
        /// <summary>
        /// Lấy danh sách hoạt động gần đây từ hệ thống
        /// </summary>
        private async Task<List<Core.ViewModels.RecentActivity>> GetRecentActivitiesAsync()
        {
            var activities = new List<Core.ViewModels.RecentActivity>();
            
            try
            {
                // Get recent orders (last 5)
                var recentOrders = await _unitOfWork.Orders.GetAllAsync();
                var latestOrders = recentOrders.OrderByDescending(o => o.OrderDate).Take(3);
                
                foreach (var order in latestOrders)
                {
                    activities.Add(new Core.ViewModels.RecentActivity
                    {
                        Title = "Đơn Hàng Mới",
                        Description = $"Đơn hàng #{order.Id} - {order.TotalAmount:N0} VND",
                        Type = "success",
                        TimeAgo = GetTimeAgo(order.OrderDate),
                        Link = $"/Admin/OrdersAdmin/Details/{order.Id}"
                    });
                }
                
                // Get recent user registrations (last 2)
                var recentUsers = _userManager.Users.OrderByDescending(u => u.Id).Take(2);
                foreach (var user in recentUsers)
                {
                    if (await _userManager.IsInRoleAsync(user, "Customer"))
                    {
                        activities.Add(new Core.ViewModels.RecentActivity
                        {
                            Title = "Người Dùng Mới",
                            Description = $"{user.Email} đã đăng ký tài khoản",
                            Type = "info",
                            TimeAgo = "Gần đây",
                            Link = $"/Admin/CustomersAdmin/Details/{user.Id}"
                        });
                    }
                }
                
                // Get recent contact messages (last 2)
                var recentMessages = await _unitOfWork.ContactMessages.GetAllAsync();
                var latestMessages = recentMessages.OrderByDescending(m => m.CreatedAt).Take(2);
                
                foreach (var message in latestMessages)
                {
                    activities.Add(new Core.ViewModels.RecentActivity
                    {
                        Title = "Tin Nhắn Mới",
                        Description = $"Từ {message.Name}: {message.Subject}",
                        Type = message.IsRead ? "primary" : "warning",
                        TimeAgo = GetTimeAgo(message.CreatedAt),
                        Link = $"/Admin/ContactMessagesAdmin/Details/{message.Id}"
                    });
                }
                
                return activities.OrderByDescending(a => a.CreatedAt).Take(5).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activities");
                return new List<Core.ViewModels.RecentActivity>();
            }
        }
        
        /// <summary>
        /// Lấy danh sách thông báo cho admin
        /// </summary>
        private async Task<List<Core.ViewModels.AdminNotification>> GetNotificationsAsync()
        {
            var notifications = new List<Core.ViewModels.AdminNotification>();
            
            try
            {
                // Check for low stock products
                var lowStockProducts = await _unitOfWork.Products.FindAsync(p => p.StockQuantity <= 10); // Assume 10 as low stock threshold
                if (lowStockProducts.Any())
                {
                    notifications.Add(new Core.ViewModels.AdminNotification
                    {
                        Message = $"Có {lowStockProducts.Count()} sản phẩm sắp hết hàng!",
                        Type = "warning",
                        Icon = "fa-exclamation-triangle",
                        Link = "/Admin/InventoryDashboard",
                        IsRead = false
                    });
                }
                
                // Check for unread contact messages
                var unreadMessages = await _unitOfWork.ContactMessages.CountAsync(m => !m.IsRead);
                if (unreadMessages > 0)
                {
                    notifications.Add(new Core.ViewModels.AdminNotification
                    {
                        Message = $"Có {unreadMessages} tin nhắn chưa đọc!",
                        Type = "info",
                        Icon = "fa-envelope",
                        Link = "/Admin/ContactMessagesAdmin",
                        IsRead = false
                    });
                }
                
                // Check for pending orders
                var pendingOrders = await _unitOfWork.Orders.CountAsync(o => o.Status == OrderStatus.Pending);
                if (pendingOrders > 0)
                {
                    notifications.Add(new Core.ViewModels.AdminNotification
                    {
                        Message = $"Có {pendingOrders} đơn hàng cần xử lý!",
                        Type = "primary",
                        Icon = "fa-shopping-cart",
                        Link = "/Admin/OrdersAdmin",
                        IsRead = false
                    });
                }
                
                return notifications.Take(5).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notifications");
                return new List<Core.ViewModels.AdminNotification>();
            }
        }
        
        /// <summary>
        /// Helper method để tính thời gian đã trôi qua
        /// </summary>
        private string GetTimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.UtcNow - dateTime;
            
            if (timeSpan.Days > 0)
                return $"{timeSpan.Days} ngày trước";
            else if (timeSpan.Hours > 0)
                return $"{timeSpan.Hours} giờ trước";
            else if (timeSpan.Minutes > 0)
                return $"{timeSpan.Minutes} phút trước";
            else
                return "Vừa xong";
        }
        
        /// <summary>
        /// Helper method để tính toán phần trăm tăng trưởng
        /// </summary>
        private decimal CalculateGrowthPercentage(int previousValue, int currentValue)
        {
            if (previousValue == 0)
            {
                return currentValue > 0 ? 100 : 0;
            }
            
            return Math.Round(((decimal)(currentValue - previousValue) / previousValue) * 100, 1);
        }
        
        /// <summary>
        /// Helper method để format hiển thị phần trăm tăng trưởng
        /// </summary>
        private string FormatGrowthPercentage(decimal percentage)
        {
            if (percentage > 0)
                return $"+{percentage}%";
            else if (percentage < 0)
                return $"{percentage}%";
            else
                return "0%";
        }
        
        /// <summary>
        /// Tính phần trăm tăng trưởng so với kỳ trước
        /// </summary>
        private decimal CalculateGrowthPercentage(decimal currentValue, decimal previousValue)
        {
            if (previousValue == 0)
                return currentValue > 0 ? 100 : 0;
            
            return Math.Round(((currentValue - previousValue) / previousValue) * 100, 1);
        }
        
        /// <summary>
        /// Lấy dữ liệu tăng trưởng thống kê
        /// </summary>
        private async Task<object> GetGrowthStatisticsAsync()
        {
            try
            {
                var today = DateTime.Today;
                var currentMonthStart = new DateTime(today.Year, today.Month, 1);
                var previousMonthStart = currentMonthStart.AddMonths(-1);
                var previousMonthEnd = currentMonthStart.AddDays(-1);
                
                // Lấy dữ liệu tháng hiện tại
                var currentMonthProducts = await _unitOfWork.Products.CountAsync();
                var currentMonthServices = await _unitOfWork.Services.CountAsync();
                var currentMonthOrders = await _unitOfWork.Orders.CountAsync(o => o.OrderDate >= currentMonthStart);
                var currentMonthOrdersCompleted = await _unitOfWork.Orders.FindAsync(o => 
                    o.OrderDate >= currentMonthStart && o.Status == OrderStatus.Completed);
                var currentMonthRevenue = currentMonthOrdersCompleted.Sum(o => o.TotalAmount);
                
                // Lấy dữ liệu tháng trước
                var previousMonthOrders = await _unitOfWork.Orders.CountAsync(o => 
                    o.OrderDate >= previousMonthStart && o.OrderDate <= previousMonthEnd);
                var previousMonthOrdersCompleted = await _unitOfWork.Orders.FindAsync(o => 
                    o.OrderDate >= previousMonthStart && 
                    o.OrderDate <= previousMonthEnd && 
                    o.Status == OrderStatus.Completed);
                var previousMonthRevenue = previousMonthOrdersCompleted.Sum(o => o.TotalAmount);
                
                return new
                {
                    ProductGrowth = 0m, // Sản phẩm không thay đổi theo tháng, luôn là 0
                    ServiceGrowth = 0m, // Dịch vụ không thay đổi theo tháng, luôn là 0  
                    OrderGrowth = CalculateGrowthPercentage(currentMonthOrders, previousMonthOrders),
                    RevenueGrowth = CalculateGrowthPercentage(currentMonthRevenue, previousMonthRevenue)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating growth statistics");
                return new
                {
                    ProductGrowth = 0m,
                    ServiceGrowth = 0m,
                    OrderGrowth = 0m,
                    RevenueGrowth = 0m
                };
            }
        }
    }
}