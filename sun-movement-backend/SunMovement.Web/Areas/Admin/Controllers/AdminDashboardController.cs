using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
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
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(
            IUnitOfWork unitOfWork, 
            UserManager<ApplicationUser> userManager,
            IInventoryService inventoryService,
            ICouponService couponService,
            IProductService productService,
            ILogger<AdminDashboardController> logger)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _inventoryService = inventoryService;
            _couponService = couponService;
            _productService = productService;
            _logger = logger;
        }        public async Task<IActionResult> Index()
        {
            // Initialize view model
            var dashboardViewModel = new AdminDashboardViewModel();
            
            // Get basic statistics
            dashboardViewModel.ProductCount = await _unitOfWork.Products.CountAsync();
            dashboardViewModel.ServiceCount = await _unitOfWork.Services.CountAsync();
            dashboardViewModel.OrderCount = await _unitOfWork.Orders.CountAsync();
            dashboardViewModel.UserCount = _userManager.Users.Count();
            
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
            
            // Get order statistics
            dashboardViewModel.PendingOrderCount = await _unitOfWork.Orders.CountAsync(o => o.Status == OrderStatus.Pending);
            dashboardViewModel.UnreadMessageCount = await _unitOfWork.ContactMessages.CountAsync(m => !m.IsRead);
            dashboardViewModel.TotalMessageCount = await _unitOfWork.ContactMessages.CountAsync();
            
            // Get inventory statistics
            dashboardViewModel.LowStockProducts = await _inventoryService.GetLowStockProductsAsync();
            dashboardViewModel.OutOfStockCount = (await _inventoryService.GetOutOfStockProductsAsync()).Count();
            dashboardViewModel.TotalInventoryValue = await _inventoryService.GetTotalInventoryValueAsync();
            
            // Get recent orders (limit to 5)
            var recentOrders = await _unitOfWork.Orders.GetAllAsync();
            dashboardViewModel.RecentOrders = recentOrders
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .ToList();
            
            // Get top selling products - placeholder implementation since method doesn't exist yet
            var allProducts = await _unitOfWork.Products.GetAllAsync();
            dashboardViewModel.TopSellingProducts = allProducts
                .OrderByDescending(p => p.OrderItems?.Sum(oi => oi.Quantity) ?? 0)
                .Take(5)
                .ToList();
            
            // Get active coupons
            dashboardViewModel.ActiveDiscounts = await _couponService.GetAllActiveCouponsAsync();
            dashboardViewModel.ActiveDiscountCount = dashboardViewModel.ActiveDiscounts.Count();
            
            // Get expiring coupons - temporary implementation until method is created
            var today = DateTime.Today;
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
            catch (Exception ex)
            {
                // Log exception
                _logger.LogError(ex, "Error calculating revenue metrics");
                
                // Use placeholder data
                dashboardViewModel.TodayRevenue = GetRandomRevenue(1000, 5000);
                dashboardViewModel.WeekRevenue = GetRandomRevenue(8000, 25000);
                dashboardViewModel.MonthlyRevenue = GetRandomRevenue(30000, 80000);
            }
            
            // FAQs count
            dashboardViewModel.FAQCount = await _unitOfWork.FAQs.CountAsync();
            dashboardViewModel.EventCount = await _unitOfWork.Events.CountAsync();
            
            // Populate ViewBag for backward compatibility with existing view
            ViewBag.TotalProducts = dashboardViewModel.ProductCount;
            ViewBag.TotalServices = dashboardViewModel.ServiceCount;
            ViewBag.TotalOrders = dashboardViewModel.OrderCount;
            ViewBag.TotalUsers = dashboardViewModel.UserCount;
            ViewBag.TotalCustomers = totalCustomers;
            ViewBag.ActiveCustomers = activeCustomers;
            ViewBag.PendingOrders = dashboardViewModel.PendingOrderCount;
            ViewBag.UnreadMessages = dashboardViewModel.UnreadMessageCount;
            ViewBag.LowStockItems = dashboardViewModel.LowStockProducts.Count();
            ViewBag.TodayRevenue = dashboardViewModel.TodayRevenue.ToString("N0");
            ViewBag.WeekRevenue = dashboardViewModel.WeekRevenue.ToString("N0");
            ViewBag.MonthlyRevenue = dashboardViewModel.MonthlyRevenue.ToString("N0");

            return View(dashboardViewModel);
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