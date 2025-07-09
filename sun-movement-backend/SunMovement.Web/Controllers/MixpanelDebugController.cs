using Microsoft.AspNetCore.Mvc;
using SunMovement.Infrastructure.Services;

namespace SunMovement.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MixpanelDebugController : ControllerBase
    {
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<MixpanelDebugController> _logger;

        public MixpanelDebugController(
            MixpanelService mixpanelService,
            ILogger<MixpanelDebugController> logger)
        {
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        [HttpGet("test-export")]
        public async Task<IActionResult> TestExportApi()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var from = today.AddDays(-7); // Last 7 days
                var to = today;
                
                _logger.LogInformation("Using UTC dates - Today: {Today}, From: {From}, To: {To}", 
                    today.ToString("yyyy-MM-dd"), from.ToString("yyyy-MM-dd"), to.ToString("yyyy-MM-dd"));

                _logger.LogInformation("Testing Mixpanel Export API from {From} to {To}", from, to);

                // Test Page View events
                var pageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", from, to);
                _logger.LogInformation("Page Views retrieved: {Count} days", pageViews.Count);

                // Test Search events  
                var searches = await _mixpanelService.GetEventCountByDayAsync("Search", from, to);
                _logger.LogInformation("Searches retrieved: {Count} days", searches.Count);

                // Test Product View events
                var productViews = await _mixpanelService.GetEventCountByDayAsync("Product View", from, to);
                _logger.LogInformation("Product Views retrieved: {Count} days", productViews.Count);

                var result = new
                {
                    success = true,
                    date_range = new { from = from.ToString("yyyy-MM-dd"), to = to.ToString("yyyy-MM-dd") },
                    events = new
                    {
                        page_views = pageViews.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        searches = searches.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        product_views = productViews.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value)
                    },
                    totals = new
                    {
                        page_views = pageViews.Values.Sum(),
                        searches = searches.Values.Sum(),
                        product_views = productViews.Values.Sum()
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing Mixpanel Export API");
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        [HttpGet("test-today")]
        public async Task<IActionResult> TestTodayData()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var yesterday = today.AddDays(-1);
                
                _logger.LogInformation("Testing today's data (UTC): Today={Today}, Yesterday={Yesterday}", 
                    today.ToString("yyyy-MM-dd"), yesterday.ToString("yyyy-MM-dd"));

                // Test both today and yesterday to account for timezone differences
                var pageViewsToday = await _mixpanelService.GetEventCountByDayAsync("Page View", today, today);
                var pageViewsYesterday = await _mixpanelService.GetEventCountByDayAsync("Page View", yesterday, yesterday);
                
                var searchesToday = await _mixpanelService.GetEventCountByDayAsync("Search", today, today);
                var searchesYesterday = await _mixpanelService.GetEventCountByDayAsync("Search", yesterday, yesterday);

                var result = new
                {
                    success = true,
                    utc_date = today.ToString("yyyy-MM-dd"),
                    yesterday_utc = yesterday.ToString("yyyy-MM-dd"),
                    totals = new
                    {
                        page_views = pageViewsToday.Values.Sum(),
                        searches = searchesToday.Values.Sum()
                    },
                    yesterday_totals = new
                    {
                        page_views = pageViewsYesterday.Values.Sum(),
                        searches = searchesYesterday.Values.Sum()
                    },
                    details = new
                    {
                        page_views_by_day = pageViewsToday.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        searches_by_day = searchesToday.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        yesterday_page_views = pageViewsYesterday.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        yesterday_searches = searchesYesterday.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value)
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing today's Mixpanel data");
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        [HttpGet("test-recent")]
        public async Task<IActionResult> TestRecentData()
        {
            try
            {
                // Test last 3 days to catch any timezone issues
                var today = DateTime.UtcNow.Date;
                var from = today.AddDays(-3);
                var to = today;
                
                _logger.LogInformation("Testing recent data (UTC) from {From} to {To}", 
                    from.ToString("yyyy-MM-dd"), to.ToString("yyyy-MM-dd"));

                var pageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", from, to);
                var searches = await _mixpanelService.GetEventCountByDayAsync("Search", from, to);
                var productViews = await _mixpanelService.GetEventCountByDayAsync("Product View", from, to);

                var result = new
                {
                    success = true,
                    date_range = new { from = from.ToString("yyyy-MM-dd"), to = to.ToString("yyyy-MM-dd") },
                    daily_breakdown = new
                    {
                        page_views = pageViews.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        searches = searches.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value),
                        product_views = productViews.ToDictionary(kv => kv.Key.ToString("yyyy-MM-dd"), kv => kv.Value)
                    },
                    totals = new
                    {
                        page_views = pageViews.Values.Sum(),
                        searches = searches.Values.Sum(),
                        product_views = productViews.Values.Sum()
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing recent Mixpanel data");
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        [HttpGet("test-recent-events")]
        public async Task<IActionResult> TestRecentEvents()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var yesterday = today.AddDays(-1);
                var twoDaysAgo = today.AddDays(-2);

                _logger.LogInformation("🔍 Testing Export API for recent events (last 3 days)...");

                var results = new
                {
                    TestDate = DateTime.UtcNow,
                    DatesTested = new[] {
                        twoDaysAgo.ToString("yyyy-MM-dd"),
                        yesterday.ToString("yyyy-MM-dd"),
                        today.ToString("yyyy-MM-dd")
                    },
                    Results = new
                    {
                        TwoDaysAgo = new
                        {
                            Date = twoDaysAgo.ToString("yyyy-MM-dd"),
                            PageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", twoDaysAgo, twoDaysAgo),
                            Searches = await _mixpanelService.GetEventCountByDayAsync("Search", twoDaysAgo, twoDaysAgo)
                        },
                        Yesterday = new
                        {
                            Date = yesterday.ToString("yyyy-MM-dd"),
                            PageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", yesterday, yesterday),
                            Searches = await _mixpanelService.GetEventCountByDayAsync("Search", yesterday, yesterday)
                        },
                        Today = new
                        {
                            Date = today.ToString("yyyy-MM-dd"),
                            PageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", today, today),
                            Searches = await _mixpanelService.GetEventCountByDayAsync("Search", today, today)
                        }
                    }
                };

                var totalPageViews = 
                    results.Results.TwoDaysAgo.PageViews.Values.Sum() +
                    results.Results.Yesterday.PageViews.Values.Sum() +
                    results.Results.Today.PageViews.Values.Sum();

                var totalSearches = 
                    results.Results.TwoDaysAgo.Searches.Values.Sum() +
                    results.Results.Yesterday.Searches.Values.Sum() +
                    results.Results.Today.Searches.Values.Sum();

                _logger.LogInformation("📊 Recent Events Test - Total Page Views: {PageViews}, Total Searches: {Searches}", 
                    totalPageViews, totalSearches);

                return Ok(new
                {
                    Success = true,
                    Summary = new
                    {
                        TotalPageViews = totalPageViews,
                        TotalSearches = totalSearches,
                        HasData = totalPageViews > 0 || totalSearches > 0,
                        Message = totalPageViews > 0 || totalSearches > 0 
                            ? "✅ Found events in Export API" 
                            : "⚠️ No events found - check Export API delay or configuration"
                    },
                    Details = results
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing recent events");
                return BadRequest(new
                {
                    Success = false,
                    Error = ex.Message
                });
            }
        }

        [HttpGet("test-search-data")]
        public async Task<IActionResult> TestSearchData()
        {
            try
            {
                var from = DateTime.UtcNow.AddDays(-30);
                var to = DateTime.UtcNow;
                
                _logger.LogInformation("🔍 Testing Search Analytics Data - From: {From} to {To}", 
                    from.ToString("yyyy-MM-dd HH:mm:ss"), to.ToString("yyyy-MM-dd HH:mm:ss"));

                // Get search events from Mixpanel
                var searchEvents = await _mixpanelService.GetEventDataAsync("Search", from, to);
                _logger.LogInformation("📊 Retrieved {Count} search events", searchEvents.Count);

                var searchAnalytics = new List<object>();
                var searchCounts = new Dictionary<string, int>();

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
                                searchCounts[term] = searchCounts.GetValueOrDefault(term, 0) + 1;
                            }
                        }
                    }
                }

                // Convert to analytics format
                foreach (var kv in searchCounts.OrderByDescending(x => x.Value).Take(10))
                {
                    searchAnalytics.Add(new 
                    { 
                        term = kv.Key, 
                        count = kv.Value,
                        results_found = 0, // Placeholder
                        click_through_rate = 0.0 // Placeholder
                    });
                }

                var result = new
                {
                    success = true,
                    total_events = searchEvents.Count,
                    unique_terms = searchCounts.Count,
                    search_analytics = searchAnalytics,
                    raw_sample_events = searchEvents.Take(3).Select(e => new
                    {
                        timestamp = e.ContainsKey("timestamp") ? e["timestamp"] : "N/A",
                        properties = e.ContainsKey("properties") ? e["properties"] : "N/A"
                    })
                };

                _logger.LogInformation("✅ Search analytics test completed - {UniqueTerms} unique terms, {TotalEvents} total events", 
                    searchCounts.Count, searchEvents.Count);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error testing search analytics data");
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        [HttpGet("test-analytics-admin")]
        public async Task<IActionResult> TestAnalyticsAdmin()
        {
            try
            {
                _logger.LogInformation("🔍 Testing Analytics Admin data flow");
                
                var from = DateTime.UtcNow.AddDays(-30);
                var to = DateTime.UtcNow;
                
                // Test the same logic as AnalyticsAdminController
                var searchEvents = await _mixpanelService.GetEventDataAsync("Search", from, to);
                _logger.LogInformation("📊 Retrieved {Count} search events for Analytics Admin", searchEvents.Count);
                
                if (!searchEvents.Any())
                {
                    return Ok(new 
                    { 
                        success = true, 
                        message = "No search events found", 
                        search_data = new[] { 
                            new { term = "Chưa có dữ liệu tìm kiếm từ Mixpanel (30 ngày qua)", count = 0, results_found = 0, click_through = 0.0 } 
                        }
                    });
                }
                
                // Process search data exactly like AnalyticsAdminController does
                var searchAnalytics = new Dictionary<string, dynamic>();
                
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
                                    searchAnalytics[searchTerm] = new
                                    {
                                        term = searchTerm,
                                        count = 0,
                                        results_found = 0,
                                        click_throughs = 0
                                    };
                                }
                                
                                searchAnalytics[searchTerm] = new
                                {
                                    term = searchTerm,
                                    count = searchAnalytics[searchTerm].count + 1,
                                    results_found = searchAnalytics[searchTerm].results_found,
                                    click_throughs = searchAnalytics[searchTerm].click_throughs
                                };
                                
                                // Try to get results count
                                if (properties.TryGetValue("results_count", out var resultsObj) && 
                                    int.TryParse(resultsObj.ToString(), out int resultsCount))
                                {
                                    searchAnalytics[searchTerm] = new
                                    {
                                        term = searchTerm,
                                        count = searchAnalytics[searchTerm].count,
                                        results_found = resultsCount,
                                        click_throughs = searchAnalytics[searchTerm].click_throughs
                                    };
                                }
                            }
                        }
                    }
                }
                
                // Convert to final format
                var finalAnalytics = searchAnalytics.Values
                    .OrderByDescending(s => s.count)
                    .Take(10)
                    .Select(s => new { 
                        term = s.term, 
                        count = s.count, 
                        results_found = s.results_found,
                        click_through = s.count > 0 ? (double)s.click_throughs / s.count : 0.0
                    })
                    .ToArray();
                
                return Ok(new
                {
                    success = true,
                    total_events = searchEvents.Count,
                    unique_terms = searchAnalytics.Count,
                    search_data = finalAnalytics,
                    sample_event = searchEvents.Take(1).Select(e => new
                    {
                        timestamp = e.ContainsKey("timestamp") ? e["timestamp"] : "N/A",
                        properties = e.ContainsKey("properties") ? e["properties"] : "N/A"
                    }).FirstOrDefault()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error testing Analytics Admin");
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
