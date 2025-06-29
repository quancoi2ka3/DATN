using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Repositories
{
    public class CouponUsageHistoryRepository : Repository<CouponUsageHistory>, ICouponUsageHistoryRepository
    {
        public CouponUsageHistoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<bool> HasUsageAsync(string couponCode)
        {
            return await _context.CouponUsageHistory
                .AnyAsync(cuh => cuh.CouponCode == couponCode);
        }

        public async Task<IEnumerable<CouponUsageHistory>> GetByCouponCodeAsync(string couponCode)
        {
            return await _context.CouponUsageHistory
                .Include(cuh => cuh.Order)
                .Where(cuh => cuh.CouponCode == couponCode)
                .OrderByDescending(cuh => cuh.UsedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CouponUsageHistory>> GetByUserIdAsync(string userId)
        {
            return await _context.CouponUsageHistory
                .Include(cuh => cuh.Order)
                .Include(cuh => cuh.Coupon)
                .Where(cuh => cuh.UserId == userId)
                .OrderByDescending(cuh => cuh.UsedAt)
                .ToListAsync();
        }

        public async Task<int> GetUsageCountAsync(string couponCode)
        {
            return await _context.CouponUsageHistory
                .CountAsync(cuh => cuh.CouponCode == couponCode);
        }

        public async Task<decimal> GetTotalDiscountUsedAsync(string couponCode)
        {
            return await _context.CouponUsageHistory
                .Where(cuh => cuh.CouponCode == couponCode)
                .SumAsync(cuh => cuh.DiscountAmount);
        }
    }
}
