using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;

namespace SunMovement.Infrastructure.Services
{
    public partial class MixpanelService
    {
        private readonly HttpClient _httpClient;
        private readonly string? _projectToken;
        private readonly string? _apiSecret;
        private readonly ILogger<MixpanelService> _logger;

        public MixpanelService(IConfiguration configuration, ILogger<MixpanelService> logger)
        {
            _logger = logger;
            _projectToken = configuration["Mixpanel:ProjectToken"];
            _apiSecret = configuration["Mixpanel:ApiSecret"];
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://data.mixpanel.com")
            };

            // Add authorization header for API calls only if API Secret is available
            if (!string.IsNullOrEmpty(_apiSecret))
            {
                // Mixpanel uses API Secret as username with empty password
                string authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes(_apiSecret + ":"));
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
                _logger.LogInformation("Mixpanel initialized with API Secret: {SecretPreview}... using Export API", _apiSecret.Substring(0, 8));
            }
            else
            {
                _logger.LogWarning("Mixpanel API Secret not configured. Some analytics features may be limited.");
            }
            
            if (!string.IsNullOrEmpty(_projectToken))
            {
                _logger.LogInformation("Mixpanel Project Token configured: {TokenPreview}...", _projectToken.Substring(0, 8));
            }
            else
            {
                _logger.LogError("Mixpanel Project Token not configured!");
            }
        }

        // Classes for JSON deserialization
        public class MixpanelEventData
        {
            public Dictionary<string, object>? Data { get; set; }
        }
        
        public class MixpanelDailyEventData
        {
            public MixpanelDailyEventDataContent? Data { get; set; }
            
            public class MixpanelDailyEventDataContent
            {
                public Dictionary<string, List<Dictionary<string, Dictionary<string, object>>>>? Values { get; set; }
            }
        }
        
        public class MixpanelSummaryData
        {
            public MixpanelSummaryDataContent? Data { get; set; }
            
            public class MixpanelSummaryDataContent
            {
                public Dictionary<string, object>? Values { get; set; }
            }
        }
        
        public class MixpanelFunnelData
        {
            public MixpanelFunnelDataContent? Data { get; set; }
            
            public class MixpanelFunnelDataContent
            {
                public List<int>? Overall { get; set; }
            }
        }

        // Track events to Mixpanel
        public async Task<bool> TrackEventAsync(string eventName, string distinctId, Dictionary<string, object> properties)
        {
            try
            {
                if (string.IsNullOrEmpty(_projectToken))
                {
                    _logger.LogError("Mixpanel project token not configured");
                    return false;
                }

                // Prepare event data with correct format
                var eventData = new
                {
                    @event = eventName,
                    properties = new Dictionary<string, object>(properties)
                    {
                        ["token"] = _projectToken,
                        ["distinct_id"] = distinctId,
                        ["time"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                        ["$insert_id"] = Guid.NewGuid().ToString() // Prevent duplicates
                    }
                };

                var jsonData = JsonSerializer.Serialize(eventData);
                var encodedData = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonData));

                _logger.LogDebug("Sending event to Mixpanel: {EventName} for user {DistinctId}", eventName, distinctId);

                // Use Mixpanel track endpoint
                using var trackClient = new HttpClient();
                var trackUrl = $"https://api.mixpanel.com/track?data={Uri.EscapeDataString(encodedData)}";
                var response = await trackClient.PostAsync(trackUrl, new StringContent("", Encoding.UTF8, "application/json"));

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation("Successfully tracked event {EventName}: {Response}", eventName, responseContent);
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Failed to track event {EventName}: {StatusCode} - {Error}", 
                        eventName, response.StatusCode, errorContent);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking event {EventName} to Mixpanel", eventName);
                return false;
            }
        }

        public async Task<bool> TrackEventAsync(string eventName, Dictionary<string, object> properties)
        {
            var distinctId = properties.TryGetValue("distinct_id", out var id) ? id?.ToString() : null;
            distinctId ??= properties.TryGetValue("user_id", out var userId) ? userId?.ToString() : null;
            distinctId ??= $"anonymous-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

            // Call the main TrackEventAsync method
            return await TrackEventAsync(eventName, distinctId, properties);
        }

        public async Task<Dictionary<DateTime, int>> GetEventCountByDayAsync(string eventName, DateTime from, DateTime to)
        {
            try
            {
                var result = new Dictionary<DateTime, int>();
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                // Use Export API instead of Events API
                string eventParam = $"[\"{eventName}\"]";
                string encodedEventParam = Uri.EscapeDataString(eventParam);
                string endpoint = $"/api/2.0/export?from_date={fromDate}&to_date={toDate}&event={encodedEventParam}";
                
                _logger.LogDebug("Calling Mixpanel Export API: {Endpoint}", endpoint);
                
                var response = await _httpClient.GetAsync(endpoint);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Mixpanel Export API returned {StatusCode}: {Content}", response.StatusCode, errorContent);
                    return result;
                }
                
                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("🔍 Mixpanel Export API response for {EventName}: length={Length} chars", eventName, content.Length);
                
                // Check for special responses
                if (content.Trim() == "terminated early")
                {
                    _logger.LogWarning("⚠️ Mixpanel Export API returned 'terminated early' - no data available for {EventName} from {FromDate} to {ToDate}", 
                        eventName, fromDate, toDate);
                    return result;
                }
                
                // Initialize result with zero counts for each day in the range
                var currentDate = from.Date;
                while (currentDate <= to.Date)
                {
                    result[currentDate] = 0;
                    currentDate = currentDate.AddDays(1);
                }
                
                // Parse JSONL format (each line is a JSON object)
                var lines = content.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                _logger.LogInformation("📊 Found {LineCount} lines to process for event {EventName}", lines.Length, eventName);
                
                // Log first few lines for debugging
                for (int i = 0; i < Math.Min(3, lines.Length); i++)
                {
                    if (!string.IsNullOrWhiteSpace(lines[i]))
                    {
                        _logger.LogInformation("📝 Sample line {Index}: {Line}", i + 1, lines[i].Substring(0, Math.Min(200, lines[i].Length)));
                    }
                }
                
                // Count events by day
                foreach (var line in lines)
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    
                    try
                    {
                        var eventData = JsonSerializer.Deserialize<JsonElement>(line);
                        
                        // Check if this line has the expected event name
                        if (eventData.TryGetProperty("event", out var eventNameProp) && 
                            eventNameProp.GetString() == eventName)
                        {
                            _logger.LogDebug("✅ Found matching event: {EventName}", eventName);
                            
                            // Try different timestamp locations
                            DateTime? eventDate = null;
                            
                            // Method 1: Look for properties.time (Unix timestamp)
                            if (eventData.TryGetProperty("properties", out var properties) &&
                                properties.TryGetProperty("time", out var timeProperty))
                            {
                                if (timeProperty.ValueKind == JsonValueKind.Number)
                                {
                                    var timestamp = DateTimeOffset.FromUnixTimeSeconds(timeProperty.GetInt64()).DateTime;
                                    eventDate = timestamp.Date;
                                    _logger.LogDebug("📅 Found timestamp in properties.time: {Date}", eventDate);
                                }
                            }
                            
                            // Method 2: Look for top-level time field
                            if (!eventDate.HasValue && eventData.TryGetProperty("time", out var topTimeProperty))
                            {
                                if (topTimeProperty.ValueKind == JsonValueKind.Number)
                                {
                                    var timestamp = DateTimeOffset.FromUnixTimeSeconds(topTimeProperty.GetInt64()).DateTime;
                                    eventDate = timestamp.Date;
                                    _logger.LogDebug("📅 Found timestamp in top-level time: {Date}", eventDate);
                                }
                            }
                            
                            // Method 3: Look for properties.$time (ISO string)
                            if (!eventDate.HasValue && eventData.TryGetProperty("properties", out var props2) &&
                                props2.TryGetProperty("$time", out var dollarTimeProperty))
                            {
                                if (dollarTimeProperty.ValueKind == JsonValueKind.String)
                                {
                                    if (DateTime.TryParse(dollarTimeProperty.GetString(), out var parsedDate))
                                    {
                                        eventDate = parsedDate.Date;
                                        _logger.LogDebug("📅 Found timestamp in properties.$time: {Date}", eventDate);
                                    }
                                }
                            }
                            
                            // If we found a valid date, count it
                            if (eventDate.HasValue && result.ContainsKey(eventDate.Value))
                            {
                                result[eventDate.Value]++;
                                _logger.LogDebug("📈 Incremented count for {Date}: now {Count}", eventDate.Value, result[eventDate.Value]);
                            }
                            else if (eventDate.HasValue)
                            {
                                _logger.LogDebug("📅 Event date {Date} outside query range {From} to {To}", eventDate.Value, from.Date, to.Date);
                            }
                            else
                            {
                                _logger.LogWarning("⚠️ Could not extract timestamp from event data: {EventData}", line.Substring(0, Math.Min(200, line.Length)));
                            }
                        }
                        else
                        {
                            _logger.LogDebug("⏭️ Skipping non-matching event or invalid event name");
                        }
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogWarning("❌ Failed to parse event line as JSON: {Error}", ex.Message);
                        _logger.LogDebug("🔍 Invalid JSON line: {Line}", line.Substring(0, Math.Min(100, line.Length)));
                    }
                }
                
                var totalEvents = result.Values.Sum();
                _logger.LogInformation("🎯 Final results for {EventName}: {TotalEvents} events across {Days} days", 
                    eventName, totalEvents, result.Count);
                
                foreach (var kvp in result.Where(r => r.Value > 0))
                {
                    _logger.LogInformation("📈 {Date}: {Count} events", kvp.Key.ToString("yyyy-MM-dd"), kvp.Value);
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching daily event counts from Mixpanel for event {EventName}", eventName);
                return new Dictionary<DateTime, int>();
            }
        }
        
        public async Task<int> GetTotalEventCountAsync(string eventName, DateTime from, DateTime to)
        {
            try
            {
                // Use Export API to get total count
                var dailyCounts = await GetEventCountByDayAsync(eventName, from, to);
                return dailyCounts.Values.Sum();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching total event count from Mixpanel for event {EventName}", eventName);
                return 0;
            }
        }
        
        public async Task<double> GetConversionRateAsync(string startEvent, string endEvent, DateTime from, DateTime to, 
            Dictionary<string, string>? properties = null)
        {
            try
            {
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                // Build the funnel API endpoint
                var funnelData = new
                {
                    from_date = fromDate,
                    to_date = toDate,
                    funnel_id = $"{startEvent}_to_{endEvent}",
                    steps = new object[]
                    {
                        new { @event = startEvent, filters = properties },
                        new { @event = endEvent }
                    }
                };
                
                string jsonData = JsonSerializer.Serialize(funnelData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync("/api/2.0/funnels", content);
                response.EnsureSuccessStatusCode();
                
                var responseContent = await response.Content.ReadAsStringAsync();
                var funnelResult = JsonSerializer.Deserialize<MixpanelFunnelData>(responseContent);
                
                if (funnelResult?.Data?.Overall != null && 
                    funnelResult.Data.Overall.Count >= 2 && 
                    funnelResult.Data.Overall[0] > 0)
                {
                    // Calculate conversion rate
                    return (double)funnelResult.Data.Overall[1] / funnelResult.Data.Overall[0];
                }
                
                return 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating conversion rate from Mixpanel for events {StartEvent} to {EndEvent}", 
                    startEvent, endEvent);
                return 0;
            }
        }

        // Additional methods for AnalyticsService compatibility
        public async Task<List<Dictionary<string, object>>> GetEventDataAsync(string eventName, DateTime from, DateTime to)
        {
            try
            {
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                string eventParam = $"[\"{eventName}\"]";
                string encodedEventParam = Uri.EscapeDataString(eventParam);
                string endpoint = $"/api/2.0/export?from_date={fromDate}&to_date={toDate}&event={encodedEventParam}";
                
                var response = await _httpClient.GetAsync(endpoint);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Mixpanel Export API returned {StatusCode}", response.StatusCode);
                    return new List<Dictionary<string, object>>();
                }
                
                var content = await response.Content.ReadAsStringAsync();
                var events = new List<Dictionary<string, object>>();
                
                // Export API returns one JSON object per line
                var lines = content.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    if (!string.IsNullOrWhiteSpace(line))
                    {
                        try
                        {
                            var eventData = JsonSerializer.Deserialize<Dictionary<string, object>>(line);
                            if (eventData != null)
                            {
                                events.Add(eventData);
                            }
                        }
                        catch (JsonException ex)
                        {
                            _logger.LogDebug("Failed to parse event line: {Error}", ex.Message);
                        }
                    }
                }
                
                return events;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event data for {EventName}", eventName);
                return new List<Dictionary<string, object>>();
            }
        }

        public async Task<List<Dictionary<string, object>>> GetEventsByPropertyAsync(
            string eventName, string propertyName, string propertyValue, DateTime from, DateTime to)
        {
            try
            {
                var allEvents = await GetEventDataAsync(eventName, from, to);
                var filteredEvents = new List<Dictionary<string, object>>();
                
                foreach (var eventData in allEvents)
                {
                    if (eventData.TryGetValue("properties", out var propertiesObj) &&
                        propertiesObj is JsonElement propertiesElement &&
                        propertiesElement.TryGetProperty(propertyName, out var propertyElement) &&
                        propertyElement.ToString() == propertyValue)
                    {
                        filteredEvents.Add(eventData);
                    }
                }
                
                return filteredEvents;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events by property {PropertyName}={PropertyValue}", propertyName, propertyValue);
                return new List<Dictionary<string, object>>();
            }
        }

        public async Task<List<Dictionary<string, object>>> GetEventDataByPropertyAsync(
            string eventName, string propertyName, string propertyValue, DateTime from, DateTime to)
        {
            return await GetEventsByPropertyAsync(eventName, propertyName, propertyValue, from, to);
        }
    }
}
