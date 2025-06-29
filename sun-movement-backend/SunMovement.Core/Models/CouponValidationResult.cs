using System;

namespace SunMovement.Core.Models
{
    public class CouponValidationResult
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal DiscountAmount { get; set; }
        public Coupon? Coupon { get; set; }
        
        // Additional validation details
        public bool IsExpired { get; set; }
        public bool IsUsageLimitReached { get; set; }
        public bool IsMinimumOrderNotMet { get; set; }
        public bool IsCustomerUsageLimitReached { get; set; }
        public bool IsNotApplicableToProducts { get; set; }
        
        // Factory methods for common validation results
        public static CouponValidationResult Success(Coupon coupon, decimal discountAmount)
        {
            return new CouponValidationResult
            {
                IsValid = true,
                Coupon = coupon,
                DiscountAmount = discountAmount
            };
        }
        
        public static CouponValidationResult Failure(string errorMessage)
        {
            return new CouponValidationResult
            {
                IsValid = false,
                ErrorMessage = errorMessage,
                DiscountAmount = 0
            };
        }
        
        public static CouponValidationResult CouponNotFound()
        {
            return Failure("Mã giảm giá không tồn tại.");
        }
        
        public static CouponValidationResult CouponExpired()
        {
            return new CouponValidationResult
            {
                IsValid = false,
                ErrorMessage = "Mã giảm giá đã hết hạn.",
                IsExpired = true
            };
        }
        
        public static CouponValidationResult UsageLimitReached()
        {
            return new CouponValidationResult
            {
                IsValid = false,
                ErrorMessage = "Mã giảm giá đã đạt giới hạn sử dụng.",
                IsUsageLimitReached = true
            };
        }
        
        public static CouponValidationResult MinimumOrderNotMet(decimal minimumAmount)
        {
            return new CouponValidationResult
            {
                IsValid = false,
                ErrorMessage = $"Đơn hàng phải có giá trị tối thiểu {minimumAmount:C} để sử dụng mã giảm giá này.",
                IsMinimumOrderNotMet = true
            };
        }
        
        public static CouponValidationResult CustomerUsageLimitReached()
        {
            return new CouponValidationResult
            {
                IsValid = false,
                ErrorMessage = "Bạn đã sử dụng hết số lần cho phép với mã giảm giá này.",
                IsCustomerUsageLimitReached = true
            };
        }
        
        public static CouponValidationResult NotApplicableToProducts()
        {
            return new CouponValidationResult
            {
                IsValid = false,
                ErrorMessage = "Mã giảm giá không áp dụng cho các sản phẩm trong giỏ hàng.",
                IsNotApplicableToProducts = true
            };
        }
    }
}
