using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace SunMovement.Infrastructure.Repositories
{
    public class CustomerActivityRepository : Repository<CustomerActivity>, ICustomerActivityRepository
    {
        public CustomerActivityRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CustomerActivity>> GetActivitiesByUserIdAsync(string userId, int skip = 0, int take = 50)
        {
            return await _context.Set<CustomerActivity>()
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<CustomerActivity>> GetActivitiesByTypeAsync(string activityType, int skip = 0, int take = 50)
        {
            return await _context.Set<CustomerActivity>()
                .Where(a => a.ActivityType == activityType)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<CustomerActivity>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate, int skip = 0, int take = 50)
        {
            return await _context.Set<CustomerActivity>()
                .Where(a => a.CreatedAt >= startDate && a.CreatedAt <= endDate)
                .OrderByDescending(a => a.CreatedAt)
                .Skip(skip)
                .Take(take)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetActivityStatisticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Set<CustomerActivity>()
                .Where(a => a.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(a => a.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.CreatedAt <= endDate.Value);

            return await query
                .GroupBy(a => a.ActivityType)
                .Select(g => new { ActivityType = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ActivityType, x => x.Count);
        }

        public async Task<IEnumerable<CustomerActivity>> GetRecentActivitiesAsync(int count = 20)
        {
            return await _context.Set<CustomerActivity>()
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task LogActivityAsync(string userId, CustomerActivityType activityType, string description, string? additionalData = null, string? ipAddress = null, string? userAgent = null)
        {
            var activity = new CustomerActivity
            {
                UserId = userId,
                ActivityType = activityType.ToString(),
                Description = description,
                AdditionalData = additionalData,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Set<CustomerActivity>().AddAsync(activity);
            await _context.SaveChangesAsync();
        }
    }
}
