using Microsoft.AspNetCore.Mvc;
using SunMovement.Infrastructure.Services;
using System.Text.Json;

namespace SunMovement.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MixpanelProxyController : ControllerBase
    {
        private readonly MixpanelService _mixpanelService;
        private readonly ILogger<MixpanelProxyController> _logger;
        private readonly IConfiguration _configuration;

        public MixpanelProxyController(
            MixpanelService mixpanelService,
            ILogger<MixpanelProxyController> logger,
            IConfiguration configuration)
        {
            _mixpanelService = mixpanelService;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("track")]
        public async Task<IActionResult> TrackEvent([FromBody] MixpanelEventRequest request)
        {
            try
            {
                _logger.LogInformation("Proxying Mixpanel event: {EventName}", request.EventName);

                // Add server-side properties
                var enhancedProperties = new Dictionary<string, object>(request.Properties ?? new Dictionary<string, object>())
                {
                    ["server_timestamp"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    ["source"] = "server_proxy",
                    ["ip"] = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown"
                };

                // Track event using MixpanelService
                var success = await _mixpanelService.TrackEventAsync(
                    request.EventName,
                    request.DistinctId ?? $"anonymous-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}",
                    enhancedProperties
                );

                if (success)
                {
                    _logger.LogInformation("Successfully tracked Mixpanel event: {EventName}", request.EventName);
                    return Ok(new { success = true, message = "Event tracked successfully" });
                }
                else
                {
                    _logger.LogWarning("Failed to track Mixpanel event: {EventName}", request.EventName);
                    return StatusCode(500, new { success = false, message = "Failed to track event" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error proxying Mixpanel event: {EventName}", request.EventName);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetHealth()
        {
            try
            {
                // Test a simple event to check Mixpanel connectivity
                var testSuccess = await _mixpanelService.TrackEventAsync(
                    "Health Check",
                    "server-health-check",
                    new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                        ["source"] = "health_check"
                    }
                );

                return Ok(new
                {
                    mixpanel_connected = testSuccess,
                    server_time = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    status = testSuccess ? "healthy" : "degraded"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");
                return StatusCode(500, new { status = "unhealthy", error = ex.Message });
            }
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                var events = new[]
                {
                    "Page View",
                    "Search",
                    "Product View",
                    "Add to Cart"
                };

                var results = new List<object>();

                foreach (var eventName in events)
                {
                    var testData = await _mixpanelService.GetEventCountByDayAsync(
                        eventName,
                        DateTime.Now.AddDays(-7),
                        DateTime.Now
                    );

                    var totalCount = testData.Values.Sum();
                    results.Add(new
                    {
                        event_name = eventName,
                        total_count = totalCount,
                        days_with_data = testData.Count(kvp => kvp.Value > 0)
                    });
                }

                return Ok(new
                {
                    mixpanel_data_accessible = true,
                    events_summary = results,
                    test_timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mixpanel connection test failed");
                return StatusCode(500, new
                {
                    mixpanel_data_accessible = false,
                    error = ex.Message,
                    test_timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                });
            }
        }
    }

    public class MixpanelEventRequest
    {
        public string EventName { get; set; } = string.Empty;
        public string? DistinctId { get; set; }
        public Dictionary<string, object>? Properties { get; set; }
    }
}
