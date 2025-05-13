using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace SunMovement.Core.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount);
        Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber);
        Task SendContactResponseAsync(string to, string subject, string message);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount)
        {
            var subject = $"Order Confirmation #{orderNumber} - Sun Movement";
            var body = $@"
                <h2>Thank you for your order!</h2>
                <p>Your order #{orderNumber} has been received and is being processed.</p>
                <p>Total Amount: ${totalAmount:F2}</p>
                <p>We will notify you once your order has been shipped.</p>
                <p>Thank you for shopping with Sun Movement!</p>
            ";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber)
        {
            var subject = $"Your Order #{orderNumber} Has Been Shipped - Sun Movement";
            var body = $@"
                <h2>Your Order Has Been Shipped!</h2>
                <p>Your order #{orderNumber} has been shipped and is on its way to you.</p>
                <p>Tracking Number: {trackingNumber}</p>
                <p>Thank you for shopping with Sun Movement!</p>
            ";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendContactResponseAsync(string to, string subject, string message)
        {
            var emailSubject = $"Re: {subject} - Sun Movement";
            var body = $@"
                <h2>Thank you for contacting us!</h2>
                <p>We have received your message and will respond shortly.</p>
                <p>Your message: {message}</p>
                <p>Best regards,<br/>The Sun Movement Team</p>
            ";
            
            await SendEmailAsync(to, emailSubject, body);
        }

        private async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            try
            {
                var fromEmail = _configuration["Email:Sender"];
                var fromName = "Sun Movement";
                var smtpServer = _configuration["Email:SmtpServer"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
                var smtpUsername = _configuration["Email:Username"];
                var smtpPassword = _configuration["Email:Password"];

                var mail = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                mail.To.Add(new MailAddress(to));

                using var client = new SmtpClient(smtpServer, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true
                };

                await client.SendMailAsync(mail);
                _logger.LogInformation($"Email sent to {to} with subject: {subject}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email to {to}");
                // Don't throw - we don't want to fail operations if emails don't send
            }
        }
    }
}
