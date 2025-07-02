using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;

namespace SunMovement.Infrastructure.Services
{
    // This class contains additional methods for MixpanelService
    // Note: The main class is defined in MixpanelService.cs
    public partial class MixpanelService
    {
        // Class for event data
        public class MixpanelExtendedEventData
        {
            public DateTime Time { get; set; }
            public Dictionary<string, object> Properties { get; set; } = new Dictionary<string, object>();
        }

        /// <summary>
        /// Get event data from Mixpanel using Export API
        /// </summary>
        public async Task<List<Dictionary<string, object>>> GetEventDataAsync(string eventName, DateTime from, DateTime to)
        {
            try
            {
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                string endpoint = $"/api/2.0/export?from_date={fromDate}&to_date={toDate}&event={Uri.EscapeDataString($"[\"{eventName}\"]")}";
                
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                var events = new List<Dictionary<string, object>>();
                
                // Export API returns one JSON object per line
                var lines = content.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    if (!string.IsNullOrWhiteSpace(line))
                    {
                        var eventData = JsonSerializer.Deserialize<Dictionary<string, object>>(line);
                        if (eventData != null)
                        {
                            events.Add(eventData);
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

        /// <summary>
        /// Get event count breakdown by property
        /// </summary>
        public async Task<Dictionary<string, int>> GetEventBreakdownAsync(string eventName, string propertyName, DateTime from, DateTime to)
        {
            try
            {
                // Use Export API instead of JQL
                var events = await GetEventDataAsync(eventName, from, to);
                var result = new Dictionary<string, int>();
                
                foreach (var eventData in events)
                {
                    if (eventData.TryGetValue("properties", out var propertiesObj) && 
                        propertiesObj is JsonElement propertiesElement)
                    {
                        if (propertiesElement.TryGetProperty(propertyName, out var propertyValue))
                        {
                            string key = propertyValue.ToString() ?? "unknown";
                            
                            if (!result.ContainsKey(key))
                            {
                                result[key] = 0;
                            }
                            
                            result[key]++;
                        }
                    }
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event breakdown for {EventName} by {PropertyName}", eventName, propertyName);
                return new Dictionary<string, int>();
            }
        }

        /// <summary>
        /// Get user property breakdown
        /// </summary>
        public async Task<Dictionary<string, int>> GetUserPropertyBreakdownAsync(string propertyName)
        {
            try
            {
                var result = new Dictionary<string, int>();
                
                string endpoint = $"/api/2.0/engage/properties?property_name={Uri.EscapeDataString(propertyName)}";
                
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<JsonElement>(content);
                
                if (data.TryGetProperty("results", out var results) && 
                    results.ValueKind == JsonValueKind.Object)
                {
                    foreach (var property in results.EnumerateObject())
                    {
                        if (int.TryParse(property.Value.GetRawText(), out int count))
                        {
                            result[property.Name] = count;
                        }
                    }
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user property breakdown for {PropertyName}", propertyName);
                return new Dictionary<string, int>();
            }
        }

        /// <summary>
        /// Get funnel conversion data
        /// </summary>
        public async Task<List<int>> GetFunnelDataAsync(List<string> steps, DateTime from, DateTime to)
        {
            try
            {
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                var stepsObjects = steps.Select(s => new { @event = s }).ToList();
                
                var requestData = new
                {
                    funnel_id = "conversion_funnel",
                    from_date = fromDate,
                    to_date = toDate,
                    steps = stepsObjects
                };
                
                string jsonData = JsonSerializer.Serialize(requestData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                
                string endpoint = "/api/2.0/funnels";
                
                var response = await _httpClient.PostAsync(endpoint, content);
                response.EnsureSuccessStatusCode();
                
                var responseContent = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<MixpanelFunnelData>(responseContent);
                
                return data?.Data?.Overall ?? new List<int>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving funnel data");
                return new List<int>();
            }
        }

        /// <summary>
        /// Get total event count in a time period with extended details
        /// </summary>
        public async Task<(int Count, Dictionary<string, int> Breakdown)> GetTotalEventCountExtendedAsync(string eventName, DateTime from, DateTime to, string? breakdownProperty = null)
        {
            try
            {
                var dailyCounts = await GetEventCountByDayAsync(eventName, from, to);
                var totalCount = dailyCounts.Values.Sum();
                
                // Optional breakdown by property if specified
                Dictionary<string, int>? breakdown = new Dictionary<string, int>();
                if (!string.IsNullOrEmpty(breakdownProperty))
                {
                    breakdown = await GetEventBreakdownAsync(eventName, breakdownProperty, from, to);
                }
                
                return (totalCount, breakdown);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting extended count for event {EventName}", eventName);
                return (0, new Dictionary<string, int>());
            }
        }

        /// <summary>
        /// Track an event to Mixpanel
        /// </summary>
        public async Task<bool> TrackEventAsync(string eventName, string distinctId, Dictionary<string, object> properties)
        {
            try
            {
                if (string.IsNullOrEmpty(_projectToken))
                {
                    _logger.LogWarning("Mixpanel project token is not configured");
                    return false;
                }
                
                properties["token"] = _projectToken;
                properties["distinct_id"] = distinctId;
                properties["time"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                
                var eventData = new
                {
                    @event = eventName,
                    properties
                };
                
                string jsonData = JsonSerializer.Serialize(eventData);
                string base64Data = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonData));
                
                using var httpClient = new HttpClient();
                var content = new StringContent($"data={base64Data}", Encoding.UTF8, "application/x-www-form-urlencoded");
                
                var response = await httpClient.PostAsync("https://api.mixpanel.com/track", content);
                response.EnsureSuccessStatusCode();
                
                var responseContent = await response.Content.ReadAsStringAsync();
                return responseContent == "1";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking event {EventName}", eventName);
                return false;
            }
        }
    }
}
