using SunMovement.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface ICouponService
    {
        // Quản lý mã giảm giá
        Task<IEnumerable<Coupon>> GetAllActiveCouponsAsync();
        Task<Coupon?> GetCouponByCodeAsync(string code);
        Task<Coupon> CreateCouponAsync(Coupon coupon);
        Task<bool> UpdateCouponAsync(Coupon coupon);
        Task<bool> DeactivateCouponAsync(int couponId);
        Task<bool> DeleteCouponAsync(int couponId);
        
        // Validation và áp dụng
        Task<CouponValidationResult> ValidateCouponAsync(string code, decimal orderTotal, string userId, IEnumerable<CartItem> items);
        Task<decimal> CalculateDiscountAsync(string code, decimal orderTotal, IEnumerable<CartItem> items);
        Task<bool> ApplyCouponAsync(string code, int orderId, string userId, decimal discountAmount);
        Task<IEnumerable<Coupon>> GetApplicableCouponsAsync(decimal orderTotal, IEnumerable<CartItem> items);
        
        // Tạo mã giảm giá tự động
        Task<IEnumerable<Coupon>> GenerateAgedInventoryCouponsAsync(int daysThreshold, decimal discountPercentage, int validityDays);
        Task<Coupon> GenerateWelcomeCouponAsync(string newUserId, decimal discountPercentage = 10);
        Task<Coupon> GenerateSeasonalCouponAsync(string occasion, decimal discountValue, CouponType type, int validityDays = 30);
        
        // Email campaign methods
        Task<bool> SendWelcomeCouponEmailAsync(string email, string customerName);
        Task<bool> SendSeasonalCouponCampaignAsync(string occasion, IEnumerable<string> customerEmails);
        Task<bool> SendBirthdayCouponEmailAsync(string email, string customerName);
        Task<bool> SendLoyaltyRewardCouponAsync(string email, string customerName, int orderCount, decimal totalSpent);
        Task<bool> SendAbandonedCartCouponAsync(string email, string customerName, decimal cartValue);
        Task<bool> SendCustomCouponCampaignAsync(int couponId, IEnumerable<string> customerEmails, string campaignName, string campaignDescription);
        
        // Thống kê và báo cáo
        Task<CouponStatistics> GetCouponStatisticsAsync(int couponId);
        Task<IEnumerable<CouponUsageHistory>> GetCouponUsageHistoryAsync(int couponId);
        Task<IEnumerable<Coupon>> GetExpiredCouponsAsync();
        Task<IEnumerable<Coupon>> GetMostUsedCouponsAsync(int count = 10);
        
        // Utilities
        Task<bool> IsCouponCodeUniqueAsync(string code, int? excludeId = null);
        Task<string> GenerateUniqueCouponCodeAsync(string prefix = "");
        Task CleanupExpiredCouponsAsync();
        
        // Product integration methods
        Task<IEnumerable<Coupon>> GetActiveCouponsAsync();
        Task ApplyCouponsToProductAsync(int productId, List<int> couponIds);
        Task RemoveCouponsFromProductAsync(int productId, List<int> couponIds);
        Task<IEnumerable<Coupon>> GetProductCouponsAsync(int productId);
        Task<IEnumerable<Product>> GetProductsWithCouponAsync(int couponId);
        Task<bool> IsProductEligibleForCouponAsync(int productId, int couponId);
        Task<decimal> CalculateProductDiscountAsync(int productId, int couponId, decimal orderTotal);
        
        // Quản lý liên kết sản phẩm và mã giảm giá
        Task<IEnumerable<int>> GetCouponProductIdsAsync(int couponId);
        Task<bool> UpdateCouponProductsAsync(int couponId, IEnumerable<int> productIds);
        Task<bool> ApplyCouponToProductAsync(int couponId, int productId);
        Task<bool> RemoveCouponFromProductAsync(int couponId, int productId);
    }
}
