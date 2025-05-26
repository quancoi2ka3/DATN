using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Core.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendOrderConfirmationAsync(Order order)
        {
            if (order == null || string.IsNullOrEmpty(order.Email))
            {
                _logger.LogWarning("Cannot send order confirmation: order is null or has no email");
                return;
            }
            
            await SendOrderConfirmationAsync(order.Email, order.Id.ToString(), order.TotalAmount);
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
        }        public async Task SendOrderStatusUpdateAsync(Order order)
        {
            if (order == null)
            {
                _logger.LogWarning("Cannot send order status update: order is null");
                return;
            }

            if (string.IsNullOrEmpty(order.Email))
            {
                _logger.LogWarning($"Cannot send order status update: order #{order.Id} has no email");
                return;
            }
            
            string email = order.Email; // Store in non-null local variable
            var subject = $"Order Status Update #{order.Id} - Sun Movement";
            var body = $@"
                <h2>Your Order Status Has Been Updated</h2>
                <p>Your order #{order.Id} has been updated to status: {order.Status}</p>
                <p>Thank you for shopping with Sun Movement!</p>
            ";
            
            await SendEmailAsync(email, subject, body);
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

        public async Task SendContactNotificationAsync(ContactMessage message)
        {
            if (message == null)
            {
                _logger.LogWarning("Cannot send contact notification: message is null");
                return;
            }

            var toEmail = _configuration["Email:ContactNotifications"] ?? _configuration["Email:Sender"];
            var subject = $"New Contact Form Submission: {message.Subject}";
            var body = $@"
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> {message.Name} ({message.Email})</p>
                <p><strong>Phone:</strong> {message.Phone}</p>
                <p><strong>Subject:</strong> {message.Subject}</p>
                <p><strong>Message:</strong></p>
                <p>{message.Message.Replace(Environment.NewLine, "<br/>")}</p>
                <hr>
                <p>You can respond to this message via the admin dashboard.</p>
            ";
            
            await SendEmailAsync(toEmail, subject, body);
        }        public async Task SendContactResponseAsync(string to, string subject, string message)
        {
            if (string.IsNullOrEmpty(to))
            {
                _logger.LogWarning("Cannot send contact response: recipient email is empty");
                return;
            }

            var emailSubject = $"Re: {subject} - Sun Movement";
            var body = $@"
                <h2>Thank you for contacting us!</h2>
                <p>We have received your message and will respond shortly.</p>
                <p>Your message: {message}</p>
                <p>Best regards,<br/>The Sun Movement Team</p>
            ";
            
            await SendEmailAsync(to, emailSubject, body);
        }private async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            if (string.IsNullOrEmpty(to))
            {
                _logger.LogWarning("Cannot send email: recipient email is empty");
                return;
            }

            try
            {
                var fromEmail = _configuration["Email:Sender"] ?? "noreply@sunmovement.com";
                var fromName = "Sun Movement";
                var smtpServer = _configuration["Email:SmtpServer"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["Email:Username"];
                var smtpPassword = _configuration["Email:Password"];

                if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    _logger.LogWarning("SMTP configuration is incomplete. Email not sent.");
                    return;
                }

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
