using Microsoft.AspNetCore.Mvc;
using SunMovement.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SunMovement.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MixpanelTestController : ControllerBase
    {
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<MixpanelTestController> _logger;

        public MixpanelTestController(
            MixpanelService mixpanelService,
            ILogger<MixpanelTestController> logger)
        {
            _mixpanelService = mixpanelService;
            _logger = logger;
        }

        [HttpPost("send-test-events")]
        public async Task<IActionResult> SendTestEvents()
        {
            try
            {
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var distinctId = $"test-user-{DateTime.UtcNow:yyyyMMdd-HHmmss}";

                var events = new[]
                {
                    new
                    {
                        eventName = "Page View",
                        properties = new Dictionary<string, object>
                        {
                            ["page_name"] = "Test Home Page",
                            ["page_url"] = "http://localhost:3000/test",
                            ["page_title"] = "Test Page - Sun Movement",
                            ["timestamp"] = timestamp,
                            ["time"] = timestamp,
                            ["distinct_id"] = distinctId,
                            ["user_id"] = distinctId
                        }
                    },
                    new
                    {
                        eventName = "Search",
                        properties = new Dictionary<string, object>
                        {
                            ["search_term"] = "test search term",
                            ["results_count"] = 10,
                            ["timestamp"] = timestamp,
                            ["time"] = timestamp,
                            ["distinct_id"] = distinctId,
                            ["user_id"] = distinctId
                        }
                    },
                    new
                    {
                        eventName = "Product View",
                        properties = new Dictionary<string, object>
                        {
                            ["product_id"] = "test-product-123",
                            ["product_name"] = "Test Product",
                            ["product_price"] = 99.99,
                            ["timestamp"] = timestamp,
                            ["time"] = timestamp,
                            ["distinct_id"] = distinctId,
                            ["user_id"] = distinctId
                        }
                    }
                };

                var results = new List<object>();

                foreach (var eventData in events)
                {
                    try
                    {
                        await _mixpanelService.TrackEventAsync(eventData.eventName, eventData.properties);
                        results.Add(new { 
                            @event = eventData.eventName, 
                            status = "success",
                            timestamp = timestamp
                        });
                        _logger.LogInformation("Successfully sent test event: {EventName}", eventData.eventName);
                    }
                    catch (Exception ex)
                    {
                        results.Add(new { 
                            @event = eventData.eventName, 
                            status = "failed", 
                            error = ex.Message 
                        });
                        _logger.LogError(ex, "Failed to send test event: {EventName}", eventData.eventName);
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Test events sent",
                    timestamp_utc = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                    unix_timestamp = timestamp,
                    distinct_id = distinctId,
                    results = results
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending test events");
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        [HttpGet("check-recent-events")]
        public async Task<IActionResult> CheckRecentEvents()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var threeDaysAgo = today.AddDays(-3);

                _logger.LogInformation("Checking events from {From} to {To}", threeDaysAgo, today);

                // Check events for the last 3 days
                var pageViews = await _mixpanelService.GetEventCountByDayAsync("Page View", threeDaysAgo, today);
                var searches = await _mixpanelService.GetEventCountByDayAsync("Search", threeDaysAgo, today);
                var productViews = await _mixpanelService.GetEventCountByDayAsync("Product View", threeDaysAgo, today);

                return Ok(new
                {
                    success = true,
                    date_range = new 
                    { 
                        from = threeDaysAgo.ToString("yyyy-MM-dd"), 
                        to = today.ToString("yyyy-MM-dd") 
                    },
                    current_utc = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
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
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking recent events");
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }
    }
}
