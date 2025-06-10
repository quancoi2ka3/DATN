using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>
    {
        private readonly ApplicationDbContext _dbContext;

        public OrderRepository(ApplicationDbContext context) : base(context)
        {
            _dbContext = context;
        }        public override async Task<Order> GetOrderWithDetailsAsync(int id)
        {
            try
            {
                // Use string-based include to avoid nullability issues
                var order = await _dbContext.Orders
                    .Include("Items.Product")
                    .FirstOrDefaultAsync(o => o.Id == id);
                
                return order ?? new Order(); // Return empty order if null to avoid null reference exceptions
            }
            catch (Exception)
            {
                // Fallback if there's an issue with the include
                var order = await _dbContext.Orders
                    .FirstOrDefaultAsync(o => o.Id == id);
                
                return order ?? new Order();
            }
        }

        public override async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _dbContext.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _dbContext.Orders
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status, int skip, int take, string? searchTerm = null)
        {
            var query = _dbContext.Orders
                .Where(o => o.Status == status);
                
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(o => 
                    o.Id.ToString().Contains(searchTerm) ||
                    o.Email.Contains(searchTerm) ||
                    o.PhoneNumber.Contains(searchTerm) ||
                    (o.TrackingNumber != null && o.TrackingNumber.Contains(searchTerm)) ||
                    o.UserId.Contains(searchTerm));
            }
            
            return await query
                .OrderByDescending(o => o.OrderDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetOrdersCountByStatusAsync(OrderStatus status, string? searchTerm = null)
        {
            var query = _dbContext.Orders
                .Where(o => o.Status == status);
                
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(o => 
                    o.Id.ToString().Contains(searchTerm) ||
                    o.Email.Contains(searchTerm) ||
                    o.PhoneNumber.Contains(searchTerm) ||
                    (o.TrackingNumber != null && o.TrackingNumber.Contains(searchTerm)) ||
                    o.UserId.Contains(searchTerm));
            }
            
            return await query.CountAsync();
        }

        public async Task<IEnumerable<Order>> GetRecentOrdersAsync(int count)
        {
            return await _dbContext.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersInDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersInDateRangeAsync(DateTime startDate, DateTime endDate, 
            OrderStatus? status = null, string? searchTerm = null, int skip = 0, int take = 20)
        {
            var query = _dbContext.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);
                
            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }
                
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(o => 
                    o.Id.ToString().Contains(searchTerm) ||
                    o.Email.Contains(searchTerm) ||
                    o.PhoneNumber.Contains(searchTerm) ||
                    (o.TrackingNumber != null && o.TrackingNumber.Contains(searchTerm)) ||
                    o.UserId.Contains(searchTerm));
            }
            
            return await query
                .OrderByDescending(o => o.OrderDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetOrdersCountInDateRangeAsync(DateTime startDate, DateTime endDate, 
            OrderStatus? status = null, string? searchTerm = null)
        {
            var query = _dbContext.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);
                
            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }
                
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(o => 
                    o.Id.ToString().Contains(searchTerm) ||
                    o.Email.Contains(searchTerm) ||
                    o.PhoneNumber.Contains(searchTerm) ||
                    (o.TrackingNumber != null && o.TrackingNumber.Contains(searchTerm)) ||
                    o.UserId.Contains(searchTerm));
            }
            
            return await query.CountAsync();
        }

        public async Task<IEnumerable<Order>> SearchOrdersAsync(string searchTerm, int skip = 0, int take = 20)
        {
            return await _dbContext.Orders
                .Where(o => 
                    o.Id.ToString().Contains(searchTerm) ||
                    o.Email.Contains(searchTerm) ||
                    o.PhoneNumber.Contains(searchTerm) ||
                    (o.TrackingNumber != null && o.TrackingNumber.Contains(searchTerm)) ||
                    o.UserId.Contains(searchTerm))
                .OrderByDescending(o => o.OrderDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetOrdersCountBySearchTermAsync(string searchTerm)
        {
            return await _dbContext.Orders
                .Where(o => 
                    o.Id.ToString().Contains(searchTerm) ||
                    o.Email.Contains(searchTerm) ||
                    o.PhoneNumber.Contains(searchTerm) ||
                    (o.TrackingNumber != null && o.TrackingNumber.Contains(searchTerm)) ||
                    o.UserId.Contains(searchTerm))
                .CountAsync();
        }

        public async Task<IEnumerable<Order>> GetPagedOrdersAsync(int skip, int take)
        {
            return await _dbContext.Orders
                .OrderByDescending(o => o.OrderDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetTotalOrdersCountAsync()
        {
            return await _dbContext.Orders.CountAsync();
        }

        public async Task<Dictionary<string, int>> GetDailyOrderCountsAsync(int days)
        {
            var endDate = DateTime.Today.AddDays(1); // Include today
            var startDate = endDate.AddDays(-days);
            
            var orders = await _dbContext.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate)
                .ToListAsync();
            
            // Create a dictionary with all days in the range
            var result = new Dictionary<string, int>();
            for (int i = 0; i < days; i++)
            {
                var day = startDate.AddDays(i).ToString("yyyy-MM-dd");
                result[day] = 0;
            }
            
            // Fill in actual counts
            foreach (var order in orders)
            {
                var day = order.OrderDate.ToString("yyyy-MM-dd");
                if (result.ContainsKey(day))
                {
                    result[day]++;
                }
            }
            
            return result;
        }

        
    }    // Classes moved to Core.Models namespace
}
