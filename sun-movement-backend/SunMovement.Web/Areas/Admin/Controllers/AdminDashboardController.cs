using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminDashboardController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }        public async Task<IActionResult> Index()
        {
            // Get dashboard statistics
            var totalProducts = await _unitOfWork.Products.CountAsync();
            var totalServices = await _unitOfWork.Services.CountAsync();
            var totalOrders = await _unitOfWork.Orders.CountAsync();
            var totalUsers = _userManager.Users.Count();
            
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
            
            var pendingOrders = await _unitOfWork.Orders.CountAsync(o => o.Status == OrderStatus.Pending);
            var unreadMessages = await _unitOfWork.ContactMessages.CountAsync(m => !m.IsRead);

            // Enhanced analytics data
            var todayPageViews = GetRandomStat(800, 1500); // Mock data - replace with real analytics
            var todaySearches = GetRandomStat(200, 500);
            var pendingPayments = await _unitOfWork.Orders.CountAsync(o => o.Status == OrderStatus.Pending);
            var lowStockItems = await _unitOfWork.Products.CountAsync(p => p.StockQuantity < 10);
            var newReviews = GetRandomStat(5, 20); // Mock data - implement reviews system later

            // Revenue calculations (mock data - replace with real payment data)
            var todayRevenue = GetRandomRevenue(1000, 5000);
            var weekRevenue = GetRandomRevenue(8000, 25000);
            var monthlyRevenue = GetRandomRevenue(30000, 80000);            // Set ViewBag properties
            ViewBag.TotalProducts = totalProducts;
            ViewBag.TotalServices = totalServices;
            ViewBag.TotalOrders = totalOrders;
            ViewBag.TotalUsers = totalUsers;
            ViewBag.TotalCustomers = totalCustomers;
            ViewBag.ActiveCustomers = activeCustomers;
            ViewBag.PendingOrders = pendingOrders;
            ViewBag.UnreadMessages = unreadMessages;
            
            // Enhanced analytics
            ViewBag.TodayPageViews = todayPageViews;
            ViewBag.TodaySearches = todaySearches;
            ViewBag.PendingPayments = pendingPayments;
            ViewBag.LowStockItems = lowStockItems;
            ViewBag.NewReviews = newReviews;
            
            // Revenue data
            ViewBag.TodayRevenue = todayRevenue.ToString("N0");
            ViewBag.WeekRevenue = weekRevenue.ToString("N0");
            ViewBag.MonthlyRevenue = monthlyRevenue.ToString("N0");

            return View();
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