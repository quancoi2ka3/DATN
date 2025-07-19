using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.Interfaces;
using SunMovement.Infrastructure.Services;
using System.Linq;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.EntityFrameworkCore;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class AnalyticsAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAnalyticsService _analyticsService;
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<AnalyticsAdminController> _logger;

        public AnalyticsAdminController(
            IUnitOfWork unitOfWork, 
            IAnalyticsService analyticsService, 
            MixpanelService mixpanelService,
            ILogger<AnalyticsAdminController> logger)
        {
            _unitOfWork = unitOfWork;
            _analyticsService = analyticsService;
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                // Get real analytics data
                var totalProducts = await _unitOfWork.Products.CountAsync();
                var totalServices = await _unitOfWork.Services.CountAsync();
                var totalOrders = await _unitOfWork.Orders.CountAsync();

                // Get real analytics data from Mixpanel via service
                var from = DateTime.Now.AddDays(-30);
                var to = DateTime.Now;
                var metrics = await _analyticsService.GetDashboardMetricsAsync(from, to);
                
                // Calculate real daily, weekly and monthly page views from Mixpanel
                var todayFrom = DateTime.Today;
                var todayTo = DateTime.Today.AddDays(1).AddSeconds(-1);
                var weekFrom = DateTime.Today.AddDays(-7);
                var monthFrom = DateTime.Today.AddDays(-30);
                
                // Get actual page view data for different periods
                var todayPageViews = await GetPageViewsForPeriodAsync(todayFrom, todayTo);
                var weekPageViews = await GetPageViewsForPeriodAsync(weekFrom, DateTime.Now);
                var monthPageViews = await GetPageViewsForPeriodAsync(monthFrom, DateTime.Now);
                
                ViewBag.PageViews = new
                {
                    Today = todayPageViews,
                    Week = weekPageViews,
                    Month = monthPageViews
                };

                // Get real search queries data from Mixpanel
                var searchQueries = await GetTopSearchQueriesAsync(from, to);
                ViewBag.SearchQueries = searchQueries;
                
                // Get top products with real view data from Mixpanel
                var topProducts = await GetTopViewedProductsAsync(from, to);
                ViewBag.TopProducts = topProducts;

                ViewBag.TotalProducts = totalProducts;
                ViewBag.TotalServices = totalServices;
                ViewBag.TotalOrders = totalOrders;

                _logger.LogInformation("Analytics dashboard loaded - PageViews: Today={Today}, Week={Week}, Month={Month}, SearchQueries={SearchCount}, TopProducts={ProductCount}", 
                    todayPageViews, weekPageViews, monthPageViews, 
                    searchQueries.Length, topProducts.Length);

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading analytics dashboard");
                
                // Fallback data when Mixpanel is not available
                ViewBag.PageViews = new { Today = 0, Week = 0, Month = 0 };
                ViewBag.SearchQueries = new[] { new { Term = "Chưa có dữ liệu từ Mixpanel", Count = 0, Results = 0 } };
                ViewBag.TopProducts = new[] { new { Name = "Chưa có dữ liệu", Category = "N/A", Views = 0 } };
                ViewBag.TotalProducts = await _unitOfWork.Products.CountAsync();
                ViewBag.TotalServices = await _unitOfWork.Services.CountAsync();
                ViewBag.TotalOrders = await _unitOfWork.Orders.CountAsync();
                
                return View();
            }
        }

        public IActionResult Reports()
        {
            return View();
        }

        public async Task<IActionResult> SearchAnalytics()
        {
            // Get real search analytics data from Mixpanel
            var from = DateTime.Now.AddDays(-30);
            var to = DateTime.Now;
            
            _logger.LogInformation("🔍 Loading Search Analytics page - Date range: {From} to {To}", from.ToString("yyyy-MM-dd"), to.ToString("yyyy-MM-dd"));
            
            try
            {
                // Get detailed search analytics from Mixpanel - use correct event name
                _logger.LogInformation("📊 Calling Mixpanel GetEventDataAsync for 'Search' events...");
                var searchEvents = await _mixpanelService.GetEventDataAsync("Search", from, to);
                _logger.LogInformation("✅ Retrieved {Count} search events from Mixpanel", searchEvents.Count);
                
                if (!searchEvents.Any())
                {
                    _logger.LogWarning("⚠️ No search events found in Mixpanel for the last 30 days");
                    ViewBag.SearchData = new[]
                    {
                        new { Term = "Chưa có dữ liệu tìm kiếm từ Mixpanel (30 ngày qua)", Count = 0, ResultsFound = 0, ClickThrough = 0.0 }
                    };
                }
                else
                {
                    // Process search data to get analytics
                    _logger.LogInformation("📈 Processing {Count} search events...", searchEvents.Count);
                    var searchAnalytics = ProcessSearchAnalytics(searchEvents);
                    ViewBag.SearchData = searchAnalytics;
                    _logger.LogInformation("✅ Processed search analytics: {AnalyticsCount} unique terms", searchAnalytics.Length);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error getting search data from Mixpanel");
                ViewBag.SearchData = new[]
                {
                    new { Term = $"Lỗi khi lấy dữ liệu tìm kiếm từ Mixpanel: {ex.Message}", Count = 0, ResultsFound = 0, ClickThrough = 0.0 }
                };
            }

            return View();
        }

        // Helper methods to get real data from Mixpanel
        private async Task<int> GetPageViewsForPeriodAsync(DateTime from, DateTime to)
        {
            try
            {
                // Get page view events from Mixpanel for the specific period - use correct event name
                var pageViewEvents = await _mixpanelService.GetEventCountByDayAsync("Page View", from, to);
                return pageViewEvents.Values.Sum();
            }
            catch (Exception)
            {
                // Return 0 if unable to get data from Mixpanel
                return 0;
            }
        }

        private async Task<object[]> GetTopSearchQueriesAsync(DateTime from, DateTime to)
        {
            try
            {
                // Get search events from Mixpanel - use correct event name
                var searchEvents = await _mixpanelService.GetEventDataAsync("Search", from, to);
                
                if (!searchEvents.Any())
                {
                    return new[] { new { Term = "Chưa có dữ liệu tìm kiếm từ Mixpanel", Count = 0, Results = 0 } };
                }

                // Group search queries and count them
                var searchQueries = new Dictionary<string, int>();
                foreach (var searchEvent in searchEvents)
                {
                    if (searchEvent.TryGetValue("properties", out var propertiesObj))
                    {
                        var properties = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(propertiesObj.ToString() ?? "{}");
                        if (properties?.TryGetValue("search_term", out var searchTerm) == true)
                        {
                            var term = searchTerm.ToString()?.ToLower() ?? "";
                            if (!string.IsNullOrEmpty(term))
                            {
                                searchQueries[term] = searchQueries.GetValueOrDefault(term, 0) + 1;
                            }
                        }
                    }
                }

                // Return top 10 search queries
                return searchQueries
                    .OrderByDescending(kv => kv.Value)
                    .Take(10)
                    .Select(kv => new { 
                        Term = kv.Key, 
                        Count = kv.Value, 
                        Results = GetSearchResultsCount(kv.Key) // You can implement this to get actual results count
                    })
                    .ToArray();
            }
            catch (Exception)
            {
                return new[] { new { Term = "Lỗi khi lấy dữ liệu tìm kiếm", Count = 0, Results = 0 } };
            }
        }

        private async Task<object[]> GetTopViewedProductsAsync(DateTime from, DateTime to)
        {
            try
            {
                // Get product view events from Mixpanel - use correct event name
                var productViewEvents = await _mixpanelService.GetEventDataAsync("Product View", from, to);
                
                if (!productViewEvents.Any())
                {
                    // Return top products from database without view counts
                    var allProducts = await _unitOfWork.Products.GetAllAsync();
                    return allProducts
                        .Take(10)
                        .Select(p => new { p.Name, p.Category, Views = 0 })
                        .ToArray();
                }

                // Group by product and count views
                var productViews = new Dictionary<int, int>();
                foreach (var viewEvent in productViewEvents)
                {
                    if (viewEvent.TryGetValue("properties", out var propertiesObj))
                    {
                        var properties = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(propertiesObj.ToString() ?? "{}");
                        if (properties?.TryGetValue("product_id", out var productIdObj) == true)
                        {
                            if (int.TryParse(productIdObj.ToString(), out int productId))
                            {
                                productViews[productId] = productViews.GetValueOrDefault(productId, 0) + 1;
                            }
                        }
                    }
                }

                // Get top viewed products and join with product data
                var topProductIds = productViews
                    .OrderByDescending(kv => kv.Value)
                    .Take(10)
                    .Select(kv => kv.Key)
                    .ToList();

                if (topProductIds.Any())
                {
                    var products = await _unitOfWork.Products.FindAsync(p => topProductIds.Contains(p.Id));
                    return products.Select(p => new { 
                        p.Name, 
                        p.Category, 
                        Views = productViews.GetValueOrDefault(p.Id, 0) 
                    }).ToArray();
                }

                // Fallback to database products
                var fallbackProducts = await _unitOfWork.Products.GetAllAsync();
                return fallbackProducts
                    .Take(10)
                    .Select(p => new { p.Name, p.Category, Views = 0 })
                    .ToArray();
            }
            catch (Exception)
            {
                // Fallback to database products on error
                var fallbackProducts = await _unitOfWork.Products.GetAllAsync();
                return fallbackProducts
                    .Take(10)
                    .Select(p => new { p.Name, p.Category, Views = 0 })
                    .ToArray();
            }
        }

        private int GetSearchResultsCount(string searchTerm)
        {
            try
            {
                // This is a simplified implementation
                // You could implement actual search logic here to count results
                // For now, return 0 as placeholder
                return 0;
            }
            catch
            {
                return 0;
            }
        }

        private object[] ProcessSearchAnalytics(List<Dictionary<string, object>> searchEvents)
        {
            try
            {
                var searchAnalytics = new Dictionary<string, SearchAnalyticsData>();

                foreach (var searchEvent in searchEvents)
                {
                    if (searchEvent.TryGetValue("properties", out var propertiesObj))
                    {
                        var properties = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(propertiesObj.ToString() ?? "{}");
                        if (properties?.TryGetValue("search_term", out var searchTermObj) == true)
                        {
                            var searchTerm = searchTermObj.ToString()?.ToLower() ?? "";
                            if (!string.IsNullOrEmpty(searchTerm))
                            {
                                if (!searchAnalytics.ContainsKey(searchTerm))
                                {
                                    searchAnalytics[searchTerm] = new SearchAnalyticsData
                                    {
                                        Term = searchTerm,
                                        Count = 0,
                                        ResultsFound = 0,
                                        ClickThroughs = 0
                                    };
                                }

                                searchAnalytics[searchTerm].Count++;

                                // Try to get results count and click through data
                                if (properties.TryGetValue("results_count", out var resultsObj) && 
                                    int.TryParse(resultsObj.ToString(), out int resultsCount))
                                {
                                    searchAnalytics[searchTerm].ResultsFound = resultsCount;
                                }

                                if (properties.TryGetValue("clicked_result", out var clickedObj) && 
                                    bool.TryParse(clickedObj.ToString(), out bool clicked) && clicked)
                                {
                                    searchAnalytics[searchTerm].ClickThroughs++;
                                }
                            }
                        }
                    }
                }

                // Calculate click-through rates and return top 10
                return searchAnalytics.Values
                    .OrderByDescending(s => s.Count)
                    .Take(10)
                    .Select(s => new { 
                        Term = s.Term, 
                        Count = s.Count, 
                        ResultsFound = s.ResultsFound,
                        ClickThrough = s.Count > 0 ? (double)s.ClickThroughs / s.Count : 0.0
                    })
                    .ToArray();
            }
            catch (Exception)
            {
                return new[] { new { Term = "Lỗi xử lý dữ liệu tìm kiếm", Count = 0, ResultsFound = 0, ClickThrough = 0.0 } };
            }
        }

        private class SearchAnalyticsData
        {
            public string Term { get; set; } = "";
            public int Count { get; set; }
            public int ResultsFound { get; set; }
            public int ClickThroughs { get; set; }
        }

        // API endpoint to get search analytics data for AJAX calls
        [HttpGet("api/search-analytics")]
        public async Task<IActionResult> GetSearchAnalyticsApi()
        {
            try
            {
                var from = DateTime.Now.AddDays(-30);
                var to = DateTime.Now;
                
                _logger.LogInformation("🔍 API call for Search Analytics - Date range: {From} to {To}", 
                    from.ToString("yyyy-MM-dd"), to.ToString("yyyy-MM-dd"));
                
                // Get search events from Mixpanel
                var searchEvents = await _mixpanelService.GetEventDataAsync("Search", from, to);
                _logger.LogInformation("📊 Retrieved {Count} search events from Mixpanel", searchEvents.Count);
                
                if (!searchEvents.Any())
                {
                    return Ok(new { 
                        success = true, 
                        message = "No search data found",
                        data = new[] { 
                            new { Term = "Chưa có dữ liệu tìm kiếm từ Mixpanel (30 ngày qua)", Count = 0, ResultsFound = 0, ClickThrough = 0.0 } 
                        },
                        stats = new { total_events = 0, unique_terms = 0 }
                    });
                }
                
                // Process search analytics
                var searchAnalytics = ProcessSearchAnalytics(searchEvents);
                
                return Ok(new { 
                    success = true, 
                    message = "Search analytics retrieved successfully",
                    data = searchAnalytics,
                    stats = new { 
                        total_events = searchEvents.Count, 
                        unique_terms = searchAnalytics.Length 
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in GetSearchAnalyticsApi");
                return StatusCode(500, new { 
                    success = false, 
                    error = ex.Message,
                    data = new[] { 
                        new { Term = $"Lỗi API: {ex.Message}", Count = 0, ResultsFound = 0, ClickThrough = 0.0 } 
                    }
                });
            }
        }
    }
}
