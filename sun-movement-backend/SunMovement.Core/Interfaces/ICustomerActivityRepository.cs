using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface ICustomerActivityRepository : IRepository<CustomerActivity>
    {
        Task<IEnumerable<CustomerActivity>> GetActivitiesByUserIdAsync(string userId, int skip = 0, int take = 50);
        Task<IEnumerable<CustomerActivity>> GetActivitiesByTypeAsync(string activityType, int skip = 0, int take = 50);
        Task<IEnumerable<CustomerActivity>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50);
        Task<Dictionary<string, int>> GetActivityStatisticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<IEnumerable<CustomerActivity>> GetRecentActivitiesAsync(int count = 20);
        Task LogActivityAsync(string userId, CustomerActivityType activityType, string description, string? additionalData = null, string? ipAddress = null, string? userAgent = null);
    }
}
