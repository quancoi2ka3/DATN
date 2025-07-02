using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

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
                BaseAddress = new Uri("https://api.mixpanel.com")
            };

            // Add authorization header for API calls
            if (!string.IsNullOrEmpty(_apiSecret))
            {
                string authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes(_apiSecret + ":"));
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
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

        public async Task<Dictionary<DateTime, int>> GetEventCountByDayAsync(string eventName, DateTime from, DateTime to)
        {
            try
            {
                var result = new Dictionary<DateTime, int>();
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                string endpoint = $"/api/2.0/events?from_date={fromDate}&to_date={toDate}&event={Uri.EscapeDataString(eventName)}&unit=day";
                
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<MixpanelDailyEventData>(content);
                
                if (data?.Data?.Values != null)
                {
                    foreach (var eventPair in data.Data.Values)
                    {
                        var eventData = eventPair.Value;
                        foreach (var dateEntry in eventData)
                        {
                            foreach (var dateValue in dateEntry)
                            {
                                if (dateValue.Key.Length == 10) // YYYY-MM-DD format
                                {
                                    if (DateTime.TryParse(dateValue.Key, out DateTime date))
                                    {
                                        int count = Convert.ToInt32(dateValue.Value);
                                        result[date.Date] = count;
                                    }
                                }
                            }
                        }
                    }
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
                string fromDate = from.ToString("yyyy-MM-dd");
                string toDate = to.ToString("yyyy-MM-dd");
                
                string endpoint = $"/api/2.0/events?from_date={fromDate}&to_date={toDate}&event={Uri.EscapeDataString(eventName)}&type=general";
                
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<MixpanelSummaryData>(content);
                
                if (data?.Data?.Values != null && data.Data.Values.TryGetValue("total", out var total))
                {
                    return Convert.ToInt32(total);
                }
                
                return 0;
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
    }
}
