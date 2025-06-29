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
    }
}
