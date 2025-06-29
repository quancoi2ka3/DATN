using System;

namespace SunMovement.Core.Models
{
    public class CouponStatistics
    {
        public int TotalUsageCount { get; set; }
        public decimal TotalDiscountAmount { get; set; }
        public decimal AverageOrderValue { get; set; }
        public DateTime FirstUsed { get; set; }
        public DateTime LastUsed { get; set; }
        public int UniqueUsersCount { get; set; }
        public Coupon? Coupon { get; set; } // Thêm tham chiếu đến mã giảm giá
    }
}
