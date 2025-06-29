using System;

namespace SunMovement.Core.Models
{
    public class CouponUsageHistory
    {
        public int Id { get; set; }
        public int CouponId { get; set; }
        public virtual Coupon? Coupon { get; set; }
        public string CouponCode { get; set; } = string.Empty; // Thêm để tracking dễ dàng
        public int OrderId { get; set; }
        public virtual Order? Order { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime UsedAt { get; set; } = DateTime.UtcNow;
        public decimal DiscountAmount { get; set; }
        public string CustomerEmail { get; set; } = string.Empty; // Để tracking
        public string CustomerName { get; set; } = string.Empty; // Để tracking
    }
}
