using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    /// <summary>
    /// Professional Email Service using Mailgun for high-volume email delivery
    /// Alternative to SendGrid with competitive pricing and reliability
    /// </summary>
    public class MailgunEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<MailgunEmailService> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _domain;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public MailgunEmailService(
            IConfiguration configuration,
            ILogger<MailgunEmailService> logger,
            HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;
            _apiKey = _configuration["Mailgun:ApiKey"] ?? "";
            _domain = _configuration["Mailgun:Domain"] ?? "";
            _fromEmail = _configuration["Mailgun:FromEmail"] ?? _configuration["Email:Sender"] ?? "";
            _fromName = _configuration["Mailgun:FromName"] ?? "Sun Movement Fitness Center";

            // Configure HttpClient for Mailgun API
            var authString = Convert.ToBase64String(Encoding.ASCII.GetBytes($"api:{_apiKey}"));
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {authString}");
        }

        public async Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName)
        {
            try
            {
                var subject = "🌟 Xác thực email đăng ký - Sun Movement Fitness Center";
                var htmlContent = GenerateVerificationEmailTemplate(firstName, verificationCode);
                var plainTextContent = GenerateVerificationPlainText(firstName, verificationCode);

                return await SendEmailViaMailgunAsync(email, subject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendWelcomeEmailAsync(string email, string firstName)
        {
            try
            {
                var subject = "🎉 Chào mừng bạn đến với Sun Movement!";
                var htmlContent = GenerateWelcomeEmailTemplate(firstName);
                var plainTextContent = $"Chào mừng {firstName} đến với Sun Movement! Cảm ơn bạn đã đăng ký.";

                return await SendEmailViaMailgunAsync(email, subject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string resetUrl, string firstName)
        {
            try
            {
                var subject = "🔐 Đặt lại mật khẩu - Sun Movement";
                var htmlContent = GeneratePasswordResetTemplate(firstName, resetUrl);
                var plainTextContent = $"Xin chào {firstName}, click vào link sau để đặt lại mật khẩu: {resetUrl}";

                return await SendEmailViaMailgunAsync(email, subject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", email);
                return false;
            }
        }

        public async Task SendOrderConfirmationAsync(Order order)
        {
            if (order?.Email != null)
            {
                await SendOrderConfirmationAsync(order.Email, order.Id.ToString(), order.TotalAmount);
            }
        }

        public async Task SendOrderConfirmationAsync(string to, string orderNumber, decimal totalAmount)
        {
            try
            {
                var subject = $"📦 Xác nhận đơn hàng #{orderNumber} - Sun Movement";
                var htmlContent = GenerateOrderConfirmationTemplate(orderNumber, totalAmount);
                var plainTextContent = $"Đơn hàng #{orderNumber} đã được xác nhận. Tổng tiền: {totalAmount:C}";

                await SendEmailViaMailgunAsync(to, subject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order confirmation to {Email}", to);
            }
        }

        public async Task SendOrderStatusUpdateAsync(Order order)
        {
            if (order?.Email != null)
            {
                try
                {
                    var subject = $"📋 Cập nhật đơn hàng #{order.Id} - Sun Movement";
                    var htmlContent = GenerateOrderStatusUpdateTemplate(order.Id.ToString(), order.Status.ToString());
                    var plainTextContent = $"Đơn hàng #{order.Id} đã được cập nhật: {order.Status}";

                    await SendEmailViaMailgunAsync(order.Email, subject, htmlContent, plainTextContent);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send order status update for order {OrderId}", order.Id);
                }
            }
        }

        public async Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber)
        {
            try
            {
                var subject = $"🚚 Đơn hàng #{orderNumber} đã được giao - Sun Movement";
                var htmlContent = GenerateShippingConfirmationTemplate(orderNumber, trackingNumber);
                var plainTextContent = $"Đơn hàng #{orderNumber} đã được giao. Mã tracking: {trackingNumber}";

                await SendEmailViaMailgunAsync(to, subject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send shipping confirmation to {Email}", to);
            }
        }

        public async Task SendContactNotificationAsync(ContactMessage message)
        {
            if (message != null)
            {
                try
                {
                    var adminEmail = _configuration["Email:ContactNotifications"] ?? _fromEmail;
                    var subject = $"📞 Liên hệ mới: {message.Subject}";
                    var htmlContent = GenerateContactNotificationTemplate(message);
                    var plainTextContent = $"Liên hệ từ: {message.Name} ({message.Email})\nNội dung: {message.Message}";

                    await SendEmailViaMailgunAsync(adminEmail, subject, htmlContent, plainTextContent);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send contact notification");
                }
            }
        }

        public async Task SendContactResponseAsync(string to, string subject, string message)
        {
            try
            {
                var emailSubject = $"💬 Re: {subject} - Sun Movement";
                var htmlContent = GenerateContactResponseTemplate(message);
                var plainTextContent = message;

                await SendEmailViaMailgunAsync(to, emailSubject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact response to {Email}", to);
            }
        }

        private async Task<bool> SendEmailViaMailgunAsync(string to, string subject, string htmlContent, string plainTextContent)
        {
            try
            {
                // Validate configuration
                if (string.IsNullOrEmpty(_apiKey))
                {
                    _logger.LogError("Mailgun API key is not configured");
                    return false;
                }

                if (string.IsNullOrEmpty(_domain))
                {
                    _logger.LogError("Mailgun domain is not configured");
                    return false;
                }

                if (string.IsNullOrEmpty(_fromEmail))
                {
                    _logger.LogError("From email is not configured");
                    return false;
                }

                // Prepare form data for Mailgun API
                var formData = new List<KeyValuePair<string, string>>
                {
                    new("from", $"{_fromName} <{_fromEmail}>"),
                    new("to", to),
                    new("subject", subject),
                    new("text", plainTextContent),
                    new("html", htmlContent),
                    new("o:tracking", "yes"),
                    new("o:tracking-clicks", "yes"),
                    new("o:tracking-opens", "yes")
                };

                var content = new FormUrlEncodedContent(formData);

                // Send via Mailgun API
                var url = $"https://api.mailgun.net/v3/{_domain}/messages";
                var response = await _httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation("Email sent successfully via Mailgun to {Email} with subject: {Subject}. Response: {Response}", 
                        to, subject, responseContent);
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Mailgun API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception sending email via Mailgun to {Email}: {Message}", to, ex.Message);
                return false;
            }
        }

        #region Email Templates (Same as SendGrid)

        private string GenerateVerificationEmailTemplate(string firstName, string verificationCode)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Xác thực email - Sun Movement</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .content {{ padding: 30px; }}
        .otp-box {{ background-color: #fff3cd; border: 2px dashed #f39c12; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #e67e22; letter-spacing: 8px; }}
        .footer {{ background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌟 Sun Movement Fitness Center</h1>
            <p>Xác thực tài khoản của bạn</p>
        </div>
        <div class='content'>
            <h2>Xin chào {firstName}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Sun Movement Fitness Center</strong>. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP bên dưới:</p>
            
            <div class='otp-box'>
                <p>Mã xác thực của bạn:</p>
                <div class='otp-code'>{verificationCode}</div>
                <p><small>Mã có hiệu lực trong 15 phút</small></p>
            </div>
            
            <p><strong>⚠️ Lưu ý bảo mật:</strong> Không chia sẻ mã OTP với bất kỳ ai</p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement Fitness Center. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không reply.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateVerificationPlainText(string firstName, string verificationCode)
        {
            return $@"Sun Movement Fitness Center - Xác thực email

Xin chào {firstName}!

Mã OTP xác thực của bạn: {verificationCode}

Mã có hiệu lực trong 15 phút. Vui lòng nhập mã này để hoàn tất đăng ký.

Trân trọng,
Sun Movement Team";
        }

        private string GenerateWelcomeEmailTemplate(string firstName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center; }}
        .content {{ padding: 30px; background-color: #f9f9f9; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Chào mừng {firstName}!</h1>
            <p>Tài khoản đã được kích hoạt thành công</p>
        </div>
        <div class='content'>
            <h2>Bắt đầu hành trình fitness của bạn!</h2>
            <p>Chúc mừng bạn đã trở thành thành viên của Sun Movement Fitness Center.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GeneratePasswordResetTemplate(string firstName, string resetUrl)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; text-align: center; }}
        .content {{ padding: 30px; background-color: #f9f9f9; }}
        .button {{ display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔐 Đặt lại mật khẩu</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {firstName}!</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <div style='text-align: center;'>
                <a href='{resetUrl}' class='button'>Đặt lại mật khẩu</a>
            </div>
            <p>Link có hiệu lực trong 30 phút.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateOrderConfirmationTemplate(string orderNumber, decimal totalAmount)
        {
            return $@"<div>Đơn hàng #{orderNumber} đã được xác nhận. Tổng tiền: {totalAmount:C}</div>";
        }

        private string GenerateOrderStatusUpdateTemplate(string orderNumber, string status)
        {
            return $@"<div>Đơn hàng #{orderNumber} đã được cập nhật: {status}</div>";
        }

        private string GenerateShippingConfirmationTemplate(string orderNumber, string trackingNumber)
        {
            return $@"<div>Đơn hàng #{orderNumber} đã được giao. Mã tracking: {trackingNumber}</div>";
        }

        private string GenerateContactNotificationTemplate(ContactMessage message)
        {
            return $@"<div>Liên hệ từ: {message.Name} ({message.Email})<br>Nội dung: {message.Message}</div>";
        }

        private string GenerateContactResponseTemplate(string message)
        {
            return $@"<div>{message}</div>";
        }

        #endregion
    }
}
