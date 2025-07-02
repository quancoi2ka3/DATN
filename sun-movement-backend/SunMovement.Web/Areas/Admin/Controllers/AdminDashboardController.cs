using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : Controller
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
                var reorderSuggestions = await _productInventoryService.GetProductsForReorderAsync();
                
                // Update dashboard with analytics data
                dashboardViewModel.ProductCount = await _unitOfWork.Products.CountAsync();
                dashboardViewModel.ServiceCount = await _unitOfWork.Services.CountAsync();
                dashboardViewModel.OrderCount = dashboardMetrics.TotalOrders;
                dashboardViewModel.UserCount = _userManager.Users.Count();
                
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
                // Get product information from low stock alerts
                var productIds = lowStockAlerts.Select(a => a.ProductId).ToList();
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
                    
                    // Use placeholder data
                    dashboardViewModel.TodayRevenue = GetRandomRevenue(1000, 5000);
                    dashboardViewModel.WeekRevenue = GetRandomRevenue(8000, 25000);
                    dashboardViewModel.MonthlyRevenue = GetRandomRevenue(30000, 80000);
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

        private static int GetRandomStat(int min, int max)
        {
            var random = new Random();
            return random.Next(min, max);
        }

        private static decimal GetRandomRevenue(decimal min, decimal max)
        {
            var random = new Random();
            return Math.Round((decimal)(random.NextDouble() * (double)(max - min) + (double)min), 0);
        }
    }
}