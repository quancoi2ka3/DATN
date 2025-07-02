using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace SunMovement.Infrastructure.Services
{
    // Additional extension methods for MixpanelService
    public partial class MixpanelService
    {
        /// <summary>
        /// Get events filtered by a specific property value
        /// </summary>
        public async Task<IEnumerable<Dictionary<string, object>>> GetEventsByPropertyAsync(
            string eventName,
            string propertyName,
            string propertyValue,
            DateTime from,
            DateTime to)
        {
            try
            {
                var allEvents = await GetEventDataAsync(eventName, from, to);
                
                return allEvents.Where(evt => 
                {
                    if (evt.TryGetValue("properties", out var propsObj) && propsObj is JsonElement propsElement)
                    {
                        if (propsElement.TryGetProperty(propertyName, out var propValueElement))
                        {
                            string value = propValueElement.ToString();
                            return value == propertyValue;
                        }
                    }
                    return false;
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting events by property for event {EventName}, property {PropertyName}={PropertyValue}", 
                    eventName, propertyName, propertyValue);
                return new List<Dictionary<string, object>>();
            }
        }

        /// <summary>
        /// Get event data filtered by a specific property value
        /// </summary>
        public async Task<IEnumerable<Dictionary<string, object>>> GetEventDataByPropertyAsync(
            string eventName,
            string propertyName,
            string propertyValue,
            DateTime from,
            DateTime to)
        {
            // This is essentially the same as GetEventsByPropertyAsync but kept separate
            // for backward compatibility and future enhancements
            return await GetEventsByPropertyAsync(eventName, propertyName, propertyValue, from, to);
        }
    }
}
