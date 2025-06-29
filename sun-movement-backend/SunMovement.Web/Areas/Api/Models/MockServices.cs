using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Api.Models
{
    // This is a simplified implementation of IEmailService for API controllers
    // that doesn't actually send emails but satisfies the interface requirements
    public class NoOpEmailService : IEmailService
    {
        public Task SendContactNotificationAsync(ContactMessage message)
        {
            return Task.CompletedTask;
        }

        public Task SendContactResponseAsync(string to, string subject, string message)
        {
            return Task.CompletedTask;
        }

        public Task SendOrderConfirmationAsync(Order order)
        {
            return Task.CompletedTask;
        }

        public Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount)
        {
            return Task.CompletedTask;
        }

        public Task SendOrderStatusUpdateAsync(Order order)
        {
            return Task.CompletedTask;
        }        public Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber)
        {
            return Task.CompletedTask;
        }

        public Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName)
        {
            return Task.FromResult(true);
        }        public Task<bool> SendWelcomeEmailAsync(string email, string firstName)
        {
            return Task.FromResult(true);
        }

        public Task<bool> SendPasswordResetEmailAsync(string email, string resetUrl, string firstName)
        {
            return Task.FromResult(true);
        }

        public Task<bool> SendOtpEmailAsync(string email, string otpCode, string purpose)
        {
            return Task.FromResult(true);
        }
    }
}
