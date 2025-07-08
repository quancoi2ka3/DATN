using System.Threading.Tasks;
using SunMovement.Core.Models;
using System.Collections.Generic;

namespace SunMovement.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount);
        Task SendOrderConfirmationAsync(Order order);
        Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber);
        Task SendOrderStatusUpdateAsync(Order order);
        Task SendContactNotificationAsync(ContactMessage message);
        Task SendContactResponseAsync(string to, string subject, string message);
        Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName);
        Task<bool> SendWelcomeEmailAsync(string email, string firstName);
        Task<bool> SendPasswordResetEmailAsync(string email, string resetUrl, string firstName);
        Task<bool> SendOtpEmailAsync(string email, string otpCode, string purpose);
        
        // Các phương thức gửi mã giảm giá
        Task<bool> SendCouponEmailAsync(string email, string customerName, Coupon coupon, string campaignType = "general");
        Task<bool> SendCouponCampaignEmailAsync(string email, string customerName, IEnumerable<Coupon> coupons, string campaignName, string campaignDescription);
        Task<bool> SendWelcomeCouponEmailAsync(string email, string customerName, Coupon welkomeCoupon);
        Task<bool> SendSeasonalCouponEmailAsync(string email, string customerName, Coupon seasonalCoupon, string occasion);
        Task<bool> SendBirthdayCouponEmailAsync(string email, string customerName, Coupon birthdayCoupon);
        Task<bool> SendAbandonedCartCouponEmailAsync(string email, string customerName, Coupon coupon, decimal cartValue);
        Task<bool> SendCustomerLoyaltyCouponEmailAsync(string email, string customerName, Coupon loyaltyCoupon, int orderCount, decimal totalSpent);
    }
}
