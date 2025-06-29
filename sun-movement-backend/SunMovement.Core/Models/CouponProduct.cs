using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class CouponProduct
    {
        public int Id { get; set; }
        
        public int CouponId { get; set; }
        public virtual Coupon? Coupon { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        // Các thuộc tính bổ sung cho việc áp dụng mã giảm giá
        public bool IsActive { get; set; } = true;
        
        public DateTime? ActiveFrom { get; set; }
        public DateTime? ActiveTo { get; set; }
        
        // Computed properties
        public bool IsCurrentlyActive => IsActive && 
                                        (ActiveFrom == null || ActiveFrom <= DateTime.UtcNow) &&
                                        (ActiveTo == null || ActiveTo > DateTime.UtcNow);
    }
}
