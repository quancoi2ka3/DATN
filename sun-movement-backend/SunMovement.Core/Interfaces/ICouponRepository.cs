using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface ICouponRepository : IRepository<Coupon>
    {
        Task<IEnumerable<Coupon>> GetActiveCouponsAsync();
        Task<Coupon?> GetCouponByCodeAsync(string code);
        Task<IEnumerable<Coupon>> GetExpiredCouponsAsync();
        Task<IEnumerable<Coupon>> GetCouponsByTypeAsync(CouponType type);
        Task<bool> IsCouponCodeUniqueAsync(string code, int? excludeId = null);
        Task<int> GetCouponUsageCountAsync(int couponId);
        Task<IEnumerable<CouponUsageHistory>> GetCouponUsageHistoryAsync(int couponId);
    }
}
