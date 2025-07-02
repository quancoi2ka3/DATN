using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public enum CouponType
    {
        Percentage = 0,      // Giảm theo %
        FixedAmount = 1,     // Giảm số tiền cố định
        FreeShipping = 2,    // Miễn phí vận chuyển
        BuyOneGetOne = 3,    // Mua 1 tặng 1
        FixedPriceDiscount = 4 // Giảm giá cố định cho sản phẩm
    }

    public enum DiscountApplicationType
    {
        All = 0,                // Áp dụng cho toàn bộ đơn hàng
        Category = 1,          // Áp dụng cho danh mục
        Product = 2,           // Áp dụng cho sản phẩm cụ thể
        AgedInventory = 3,     // Áp dụng cho hàng tồn kho lâu
        FirstTimeCustomer = 4, // Khách hàng mới
        LoyalCustomer = 5      // Khách hàng thân thiết
    }

    public class Coupon
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty; // Mã giảm giá
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        public CouponType Type { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Value { get; set; } // % hoặc số tiền cố định
        
        [Range(0, double.MaxValue)]
        public decimal MinimumOrderAmount { get; set; } = 0; // Giá trị đơn hàng tối thiểu
        
        [Range(0, double.MaxValue)]
        public decimal MaximumDiscountAmount { get; set; } = 0; // Giới hạn số tiền giảm tối đa
        
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; } = DateTime.UtcNow.AddMonths(1);
        
        public bool IsActive { get; set; } = true;
        
        public int UsageLimit { get; set; } = 0; // Giới hạn số lần sử dụng (0 = không giới hạn)
        public int CurrentUsageCount { get; set; } = 0; // Số lần đã sử dụng
        
        public int UsageLimitPerCustomer { get; set; } = 1; // Giới hạn sử dụng mỗi khách hàng
        
        public DiscountApplicationType ApplicationType { get; set; } = DiscountApplicationType.All;
        
        [StringLength(500)]
        public string? ApplicationValue { get; set; } = string.Empty; // Category ID, Product ID, hoặc điều kiện khác
        
        // Advanced features
        public bool IsFirstOrderOnly { get; set; } = false; // Chỉ áp dụng cho đơn hàng đầu tiên
        public bool RequiresEmail { get; set; } = false;   // Yêu cầu email để sử dụng
        public bool IsPublic { get; set; } = true;         // Có hiển thị công khai không
        
        [StringLength(200)]
        public string? CreatedBy { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Stack with other coupons
        public bool CanStackWithOthers { get; set; } = false;
        
        // Auto-apply conditions
        public bool AutoApply { get; set; } = false;
        public int AutoApplyPriority { get; set; } = 0;
        
        // Navigation properties
        public virtual ICollection<CouponUsageHistory> UsageHistory { get; set; } = new List<CouponUsageHistory>();
        public virtual ICollection<CouponProduct> CouponProducts { get; set; } = new List<CouponProduct>();
        public virtual ICollection<CouponCategory> CouponCategories { get; set; } = new List<CouponCategory>();
        
        // Additional properties for inventory integration
        public bool DisableWhenProductsOutOfStock { get; set; }
        
        [StringLength(500)]
        public string? DeactivationReason { get; set; }
        
        public DateTime? LastAutoDeactivation { get; set; }
        
        public int TimesDisabledDueToInventory { get; set; }
        
        // Computed properties
        public bool IsValid => IsActive && 
                              DateTime.UtcNow >= StartDate && 
                              DateTime.UtcNow <= EndDate &&
                              (UsageLimit == 0 || CurrentUsageCount < UsageLimit);
                              
        public bool IsExpired => DateTime.UtcNow > EndDate;
        
        public bool IsUsageLimitReached => UsageLimit > 0 && CurrentUsageCount >= UsageLimit;
        
        public string TypeDisplayName => Type switch
        {
            CouponType.Percentage => "Giảm theo phần trăm",
            CouponType.FixedAmount => "Giảm số tiền cố định",
            CouponType.FreeShipping => "Miễn phí vận chuyển",
            CouponType.BuyOneGetOne => "Mua 1 tặng 1",
            CouponType.FixedPriceDiscount => "Giảm giá cố định",
            _ => "Khác"
        };
        
        public string ApplicationTypeDisplayName => ApplicationType switch
        {
            DiscountApplicationType.All => "Toàn bộ đơn hàng",
            DiscountApplicationType.Category => "Theo danh mục",
            DiscountApplicationType.Product => "Sản phẩm cụ thể",
            DiscountApplicationType.AgedInventory => "Hàng tồn kho lâu",
            DiscountApplicationType.FirstTimeCustomer => "Khách hàng mới",
            DiscountApplicationType.LoyalCustomer => "Khách hàng thân thiết",
            _ => "Khác"
        };
    }
    
    // Mapping table for category relationships
    public class CouponCategory
    {
        public int Id { get; set; }
        
        public int CouponId { get; set; }
        public virtual Coupon? Coupon { get; set; }
        
        public ProductCategory Category { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
