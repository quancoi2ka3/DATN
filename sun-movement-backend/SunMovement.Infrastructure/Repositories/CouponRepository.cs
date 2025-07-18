using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace SunMovement.Infrastructure.Repositories
{
    public class CouponRepository : Repository<Coupon>, ICouponRepository
    {
        private readonly ILogger<CouponRepository> _logger;

        public CouponRepository(ApplicationDbContext context, ILogger<CouponRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<IEnumerable<Coupon>> GetActiveCouponsAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Coupons
                .Where(c => c.IsActive && 
                           c.StartDate <= now && 
                           c.EndDate >= now &&
                           (c.UsageLimit == 0 || c.CurrentUsageCount < c.UsageLimit))
                .OrderBy(c => c.Code)
                .ToListAsync();
        }

        public async Task<Coupon?> GetCouponByCodeAsync(string code)
        {
            try
            {
                var coupon = await _context.Coupons
                    .Include(c => c.UsageHistory)
                    .FirstOrDefaultAsync(c => c.Code.ToLower() == code.ToLower());
                if (coupon == null)
                {
                    _logger.LogWarning("Không tìm thấy mã giảm giá: {Code}", code);
                }
                return coupon;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi truy vấn mã giảm giá: {Code}", code);
                throw;
            }
        }

        public async Task<IEnumerable<Coupon>> GetExpiredCouponsAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Coupons
                .Where(c => c.EndDate < now || !c.IsActive)
                .OrderByDescending(c => c.EndDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Coupon>> GetCouponsByTypeAsync(CouponType type)
        {
            return await _context.Coupons
                .Where(c => c.Type == type)
                .OrderBy(c => c.Code)
                .ToListAsync();
        }

        public async Task<bool> IsCouponCodeUniqueAsync(string code, int? excludeId = null)
        {
            var query = _context.Coupons.Where(c => c.Code == code);
            
            if (excludeId.HasValue)
            {
                query = query.Where(c => c.Id != excludeId.Value);
            }
            
            return !await query.AnyAsync();
        }

        public async Task<int> GetCouponUsageCountAsync(int couponId)
        {
            return await _context.CouponUsageHistory
                .CountAsync(cuh => cuh.CouponId == couponId);
        }

        public async Task<IEnumerable<CouponUsageHistory>> GetCouponUsageHistoryAsync(int couponId)
        {
            return await _context.CouponUsageHistory
                .Include(cuh => cuh.Order)
                .Where(cuh => cuh.CouponId == couponId)
                .OrderByDescending(cuh => cuh.UsedAt)
                .ToListAsync();
        }
    }
}
