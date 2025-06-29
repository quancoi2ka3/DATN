using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class AnalyticsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public AnalyticsAdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            // Analytics data
            var totalProducts = await _unitOfWork.Products.CountAsync();
            var totalServices = await _unitOfWork.Services.CountAsync();
            var totalOrders = await _unitOfWork.Orders.CountAsync();
            var recentOrders = await _unitOfWork.Orders.GetAllAsync();

            // Mock analytics data - replace with real analytics implementation
            ViewBag.PageViews = new
            {
                Today = GetRandomStat(800, 1500),
                Week = GetRandomStat(5000, 10000),
                Month = GetRandomStat(20000, 50000)
            };

            ViewBag.SearchQueries = new[]
            {
                new { Term = "đồ tập thể dục", Count = 245, Results = 12 },
                new { Term = "lớp yoga", Count = 189, Results = 8 },
                new { Term = "huấn luyện cá nhân", Count = 156, Results = 15 },
                new { Term = "kế hoạch dinh dưỡng", Count = 98, Results = 3 },
                new { Term = "tập luyện tại nhà", Count = 87, Results = 9 }
            };

            ViewBag.TopProducts = (await _unitOfWork.Products.GetAllAsync())
                .Take(10)
                .Select(p => new { p.Name, p.Category, Views = GetRandomStat(50, 500) });

            ViewBag.TotalProducts = totalProducts;
            ViewBag.TotalServices = totalServices;
            ViewBag.TotalOrders = totalOrders;

            return View();
        }

        public IActionResult Reports()
        {
            return View();
        }

        public IActionResult SearchAnalytics()
        {
            // Mock search analytics data
            ViewBag.SearchData = new[]
            {
                new { Term = "đồ tập thể dục", Count = 245, ResultsFound = 12, ClickThrough = 0.65 },
                new { Term = "lớp yoga", Count = 189, ResultsFound = 8, ClickThrough = 0.72 },
                new { Term = "huấn luyện cá nhân", Count = 156, ResultsFound = 15, ClickThrough = 0.58 },
                new { Term = "kế hoạch dinh dưỡng", Count = 98, ResultsFound = 3, ClickThrough = 0.31 },
                new { Term = "tập luyện tại nhà", Count = 87, ResultsFound = 9, ClickThrough = 0.69 }
            };

            return View();
        }

        private static int GetRandomStat(int min, int max)
        {
            var random = new Random();
            return random.Next(min, max);
        }
    }
}
