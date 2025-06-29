using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface ICouponUsageHistoryRepository : IRepository<CouponUsageHistory>
    {
        Task<bool> HasUsageAsync(string couponCode);
        Task<IEnumerable<CouponUsageHistory>> GetByCouponCodeAsync(string couponCode);
        Task<IEnumerable<CouponUsageHistory>> GetByUserIdAsync(string userId);
        Task<int> GetUsageCountAsync(string couponCode);
        Task<decimal> GetTotalDiscountUsedAsync(string couponCode);
    }
}
