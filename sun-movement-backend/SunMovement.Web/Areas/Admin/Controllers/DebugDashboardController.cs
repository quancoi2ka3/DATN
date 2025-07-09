using Microsoft.AspNetCore.Mvc;
using SunMovement.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class DebugDashboardController : Controller
    {
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<DebugDashboardController> _logger;

        public DebugDashboardController(MixpanelService mixpanelService, ILogger<DebugDashboardController> logger)
        {
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        public async Task<IActionResult> TestViewBag()
        {
            var today = DateTime.Today;

            try
            {
                _logger.LogInformation("Testing ViewBag data for admin dashboard");

                // Get Mixpanel data exactly like AdminDashboardController does
                var todayPageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", today, today);
                var todaySearches = await _mixpanelService.GetEventCountByDayAsync("Search", today, today);

                var pageViewsCount = todayPageViews.Values.Sum();
                var searchesCount = todaySearches.Values.Sum();

                // Set ViewBag exactly like AdminDashboardController does
                ViewBag.TodayPageViews = pageViewsCount;
                ViewBag.TodaySearches = searchesCount;

                var result = new
                {
                    TestDate = today.ToString("yyyy-MM-dd"),
                    MixpanelData = new
                    {
                        TodayPageViewsRaw = todayPageViews,
                        TodaySearchesRaw = todaySearches,
                        PageViewsCount = pageViewsCount,
                        SearchesCount = searchesCount
                    },
                    ViewBagData = new
                    {
                        TodayPageViews = ViewBag.TodayPageViews,
                        TodaySearches = ViewBag.TodaySearches
                    },
                    DebugInfo = new
                    {
                        Success = true,
                        Message = $"Found {pageViewsCount} page views and {searchesCount} searches for today",
                        TotalEvents = pageViewsCount + searchesCount
                    }
                };

                _logger.LogInformation("ViewBag test completed - Page Views: {PageViews}, Searches: {Searches}", 
                    pageViewsCount, searchesCount);

                return Json(result);

            }
            catch (Exception ex)
            {
                var errorResult = new
                {
                    TestDate = today.ToString("yyyy-MM-dd"),
                    MixpanelData = new { Error = "Failed to get data" },
                    ViewBagData = new { Error = "Not set due to exception" },
                    DebugInfo = new
                    {
                        Success = false,
                        Message = ex.Message,
                        StackTrace = ex.ToString()
                    }
                };

                _logger.LogError(ex, "ViewBag test failed");
                return Json(errorResult);
            }
        }

        public IActionResult TestDashboardView()
        {
            // Manually set some test ViewBag values
            ViewBag.TodayPageViews = 99;
            ViewBag.TodaySearches = 33;
            ViewBag.PendingPayments = 5;

            // Return the same view as AdminDashboard to test rendering
            return View("~/Areas/Admin/Views/AdminDashboard/Index.cshtml");
        }
    }
}
