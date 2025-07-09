using Microsoft.AspNetCore.Mvc;
using SunMovement.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class MixpanelDebugController : Controller
    {
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<MixpanelDebugController> _logger;

        public MixpanelDebugController(MixpanelService mixpanelService, ILogger<MixpanelDebugController> logger)
        {
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var today = DateTime.Today;
            var yesterday = today.AddDays(-1);
            var testResults = new Dictionary<string, object>();

            try
            {
                _logger.LogInformation("Testing Mixpanel API connection for date: {Date}", today.ToString("yyyy-MM-dd"));

                // Test today's events
                var todayPageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", today, today);
                var todaySearches = await _mixpanelService.GetEventCountByDayAsync("Search", today, today);
                var todayTestEvents = await _mixpanelService.GetEventCountByDayAsync("Test Event", today, today);
                var todayConnectionTests = await _mixpanelService.GetEventCountByDayAsync("Connection Test", today, today);

                // Test yesterday's events
                var yesterdayPageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", yesterday, yesterday);
                var yesterdaySearches = await _mixpanelService.GetEventCountByDayAsync("Search", yesterday, yesterday);

                testResults["Success"] = true;
                testResults["TestDate"] = today.ToString("yyyy-MM-dd");
                testResults["YesterdayDate"] = yesterday.ToString("yyyy-MM-dd");
                
                testResults["TodayPageViews"] = todayPageViews;
                testResults["TodaySearches"] = todaySearches;
                testResults["TodayTestEvents"] = todayTestEvents;
                testResults["TodayConnectionTests"] = todayConnectionTests;
                
                testResults["YesterdayPageViews"] = yesterdayPageViews;
                testResults["YesterdaySearches"] = yesterdaySearches;

                // Summary counts
                testResults["TodayPageViewsCount"] = todayPageViews.Values.Sum();
                testResults["TodaySearchesCount"] = todaySearches.Values.Sum();
                testResults["TodayTestEventsCount"] = todayTestEvents.Values.Sum();
                testResults["TodayConnectionTestsCount"] = todayConnectionTests.Values.Sum();
                
                testResults["YesterdayPageViewsCount"] = yesterdayPageViews.Values.Sum();
                testResults["YesterdaySearchesCount"] = yesterdaySearches.Values.Sum();

                _logger.LogInformation("Mixpanel test completed successfully");
            }
            catch (Exception ex)
            {
                testResults["Success"] = false;
                testResults["Error"] = ex.Message;
                testResults["ErrorDetails"] = ex.ToString();
                _logger.LogError(ex, "Mixpanel test failed");
            }

            ViewBag.TestResults = testResults;
            return View();
        }
    }
}
