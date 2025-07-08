using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    /// <summary>
    /// Mock email service for development/testing that logs emails instead of sending them
    /// </summary>
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendOrderConfirmationAsync(Order order)
        {
            if (order == null || string.IsNullOrEmpty(order.Email))
            {
                _logger.LogWarning("Mock: Cannot send order confirmation - order is null or has no email");
                return Task.CompletedTask;
            }
            
            _logger.LogInformation("📧 MOCK EMAIL: Order confirmation sent to {Email} for order #{OrderId}", order.Email, order.Id);
            return Task.CompletedTask;
        }
        
        public Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Order confirmation sent to {Email} for order #{OrderNumber} (${Amount:F2})", to, orderNumber, totalAmount);
            return Task.CompletedTask;
        }

        public Task SendOrderStatusUpdateAsync(Order order)
        {
            if (order == null || string.IsNullOrEmpty(order.Email))
            {
                _logger.LogWarning("Mock: Cannot send order status update - order is null or has no email");
                return Task.CompletedTask;
            }
            
            _logger.LogInformation("📧 MOCK EMAIL: Order status update sent to {Email} for order #{OrderId} - Status: {Status}", order.Email, order.Id, order.Status);
            return Task.CompletedTask;
        }

        public Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Shipping confirmation sent to {Email} for order #{OrderNumber} - Tracking: {TrackingNumber}", to, orderNumber, trackingNumber);
            return Task.CompletedTask;
        }

        public Task SendContactNotificationAsync(ContactMessage message)
        {
            if (message == null)
            {
                _logger.LogWarning("Mock: Cannot send contact notification - message is null");
                return Task.CompletedTask;
            }
            
            _logger.LogInformation("📧 MOCK EMAIL: Contact notification sent - From: {Name} ({Email}), Subject: {Subject}", message.Name, message.Email, message.Subject);
            return Task.CompletedTask;
        }

        public Task SendContactResponseAsync(string to, string subject, string message)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Contact response sent to {Email} - Subject: {Subject}", to, subject);
            return Task.CompletedTask;
        }

        public Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Verification code sent to {Email}", email);
            _logger.LogInformation("🔐 VERIFICATION CODE FOR {FirstName}: {VerificationCode}", firstName, verificationCode);
            _logger.LogInformation("📝 Subject: 🌟 Xác thực email đăng ký - Sun Movement Fitness Center");
            _logger.LogInformation("✅ Email would be sent successfully in production");
            
            // Always return true for mock service
            return Task.FromResult(true);
        }

        public Task<bool> SendWelcomeEmailAsync(string email, string firstName)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Welcome email sent to {Email}", email);
            _logger.LogInformation("🎉 Welcome message for {FirstName}!", firstName);
            _logger.LogInformation("📝 Subject: 🌟 Chào mừng bạn đến với Sun Movement Fitness Center!");
            
            // Always return true for mock service
            return Task.FromResult(true);
        }

        public Task<bool> SendPasswordResetEmailAsync(string email, string resetUrl, string firstName)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Password reset email sent to {Email}", email);
            _logger.LogInformation("🔒 Reset link for {FirstName}: {ResetUrl}", firstName, resetUrl);
            _logger.LogInformation("📝 Subject: 🔑 Đặt lại mật khẩu - Sun Movement");
            
            // Always return true for mock service
            return Task.FromResult(true);
        }

        public Task<bool> SendOtpEmailAsync(string email, string otpCode, string purpose)
        {
            _logger.LogInformation("📧 MOCK EMAIL: OTP sent to {Email}", email);
            _logger.LogInformation("🔐 OTP CODE: {OtpCode} (Purpose: {Purpose})", otpCode, purpose);
            _logger.LogInformation("📝 Subject: 🔐 Mã xác thực OTP - Sun Movement");
            
            // Always return true for mock service
            return Task.FromResult(true);
        }

        public Task<bool> SendCouponEmailAsync(string email, string customerName, Coupon coupon, string campaignType = "general")
        {
            _logger.LogInformation("📧 MOCK EMAIL: Coupon sent to {Email}", email);
            _logger.LogInformation("🎫 COUPON for {CustomerName}: {CouponCode} (Type: {CampaignType})", customerName, coupon.Code, campaignType);
            _logger.LogInformation("💰 Discount: {DiscountValue} ({DiscountType})", coupon.Value, coupon.Type);
            _logger.LogInformation("📝 Subject: 🎁 Mã giảm giá đặc biệt - Sun Movement");
            
            return Task.FromResult(true);
        }

        public Task<bool> SendCouponCampaignEmailAsync(string email, string customerName, IEnumerable<Coupon> coupons, string campaignName, string campaignDescription)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Coupon campaign sent to {Email}", email);
            _logger.LogInformation("🎉 Campaign for {CustomerName}: {CampaignName}", customerName, campaignName);
            _logger.LogInformation("📋 Description: {CampaignDescription}", campaignDescription);
            _logger.LogInformation("🎫 Coupons count: {CouponCount}", coupons.Count());
            _logger.LogInformation("📝 Subject: 🌟 Chiến dịch ưu đãi đặc biệt - {CampaignName}", campaignName);
            
            return Task.FromResult(true);
        }

        public Task<bool> SendWelcomeCouponEmailAsync(string email, string customerName, Coupon welkomeCoupon)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Welcome coupon sent to {Email}", email);
            _logger.LogInformation("🎁 Welcome coupon for {CustomerName}: {CouponCode}", customerName, welkomeCoupon.Code);
            _logger.LogInformation("💰 Discount: {DiscountValue} ({DiscountType})", welkomeCoupon.Value, welkomeCoupon.Type);
            _logger.LogInformation("📝 Subject: 🎉 Chào mừng bạn - Nhận ngay mã giảm giá!");
            
            return Task.FromResult(true);
        }

        public Task<bool> SendSeasonalCouponEmailAsync(string email, string customerName, Coupon seasonalCoupon, string occasion)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Seasonal coupon sent to {Email}", email);
            _logger.LogInformation("🎪 Seasonal coupon for {CustomerName}: {CouponCode} (Occasion: {Occasion})", customerName, seasonalCoupon.Code, occasion);
            _logger.LogInformation("💰 Discount: {DiscountValue} ({DiscountType})", seasonalCoupon.Value, seasonalCoupon.Type);
            _logger.LogInformation("📝 Subject: 🎊 Ưu đãi {Occasion} - Sun Movement", occasion);
            
            return Task.FromResult(true);
        }

        public Task<bool> SendBirthdayCouponEmailAsync(string email, string customerName, Coupon birthdayCoupon)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Birthday coupon sent to {Email}", email);
            _logger.LogInformation("🎂 Birthday coupon for {CustomerName}: {CouponCode}", customerName, birthdayCoupon.Code);
            _logger.LogInformation("💰 Discount: {DiscountValue} ({DiscountType})", birthdayCoupon.Value, birthdayCoupon.Type);
            _logger.LogInformation("📝 Subject: 🎂 Chúc mừng sinh nhật - Quà tặng đặc biệt!");
            
            return Task.FromResult(true);
        }

        public Task<bool> SendAbandonedCartCouponEmailAsync(string email, string customerName, Coupon coupon, decimal cartValue)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Abandoned cart coupon sent to {Email}", email);
            _logger.LogInformation("🛒 Abandoned cart coupon for {CustomerName}: {CouponCode} (Cart value: ${CartValue:F2})", customerName, coupon.Code, cartValue);
            _logger.LogInformation("💰 Discount: {DiscountValue} ({DiscountType})", coupon.Value, coupon.Type);
            _logger.LogInformation("📝 Subject: 🛒 Hoàn thành đơn hàng - Nhận mã giảm giá!");
            
            return Task.FromResult(true);
        }

        public Task<bool> SendCustomerLoyaltyCouponEmailAsync(string email, string customerName, Coupon loyaltyCoupon, int orderCount, decimal totalSpent)
        {
            _logger.LogInformation("📧 MOCK EMAIL: Loyalty coupon sent to {Email}", email);
            _logger.LogInformation("⭐ Loyalty coupon for {CustomerName}: {CouponCode}", customerName, loyaltyCoupon.Code);
            _logger.LogInformation("📊 Customer stats: {OrderCount} orders, ${TotalSpent:F2} total spent", orderCount, totalSpent);
            _logger.LogInformation("💰 Discount: {DiscountValue} ({DiscountType})", loyaltyCoupon.Value, loyaltyCoupon.Type);
            _logger.LogInformation("📝 Subject: ⭐ Cảm ơn sự trung thành - Ưu đãi đặc biệt!");
            
            return Task.FromResult(true);
        }
    }
}
