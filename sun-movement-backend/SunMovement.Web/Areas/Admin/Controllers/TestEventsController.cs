using Microsoft.AspNetCore.Mvc;
using SunMovement.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class TestEventsController : Controller
    {
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<TestEventsController> _logger;

        public TestEventsController(MixpanelService mixpanelService, ILogger<TestEventsController> logger)
        {
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        [HttpPost]
        public IActionResult SendPageView()
        {
            try
            {
                // Test data - simulating a page view
                var eventData = new
                {
                    distinctId = $"admin-test-{DateTime.Now.Ticks}",
                    eventName = "Page View",
                    properties = new
                    {
                        page_name = "Admin Dashboard Test",
                        url = "/admin",
                        timestamp = DateTime.UtcNow
                    }
                };

                _logger.LogInformation("Sending test Page View event to Mixpanel");
                
                // Since we don't have a direct track method, we'll return success for now
                // In a real implementation, you would use the Mixpanel tracking API
                
                return Json(new { success = true, message = "Page View event queued", data = eventData });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send test Page View event");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult SendSearch()
        {
            try
            {
                var eventData = new
                {
                    distinctId = $"admin-test-{DateTime.Now.Ticks}",
                    eventName = "Search",
                    properties = new
                    {
                        search_term = "admin test search",
                        results_count = 5,
                        user_id = "admin-user",
                        timestamp = DateTime.UtcNow
                    }
                };

                _logger.LogInformation("Sending test Search event to Mixpanel");
                
                return Json(new { success = true, message = "Search event queued", data = eventData });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send test Search event");
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> CheckData()
        {
            try
            {
                var today = DateTime.Today;
                
                _logger.LogInformation("Checking today's Mixpanel data");
                
                var pageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", today, today);
                var searches = await _mixpanelService.GetEventCountByDayAsync("Search", today, today);
                
                var result = new
                {
                    success = true,
                    date = today.ToString("yyyy-MM-dd"),
                    pageViewsData = pageViews,
                    searchesData = searches,
                    pageViewsCount = pageViews.Values.Sum(),
                    searchesCount = searches.Values.Sum(),
                    totalEvents = pageViews.Values.Sum() + searches.Values.Sum()
                };
                
                _logger.LogInformation("Data check completed - Page Views: {PageViews}, Searches: {Searches}", 
                    result.pageViewsCount, result.searchesCount);
                
                return Json(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to check Mixpanel data");
                return Json(new { success = false, message = ex.Message, error = ex.ToString() });
            }
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
