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
    /// Zoho Mail API Email Service - Professional business email solution
    /// Zoho Mail provides excellent deliverability, business features, and competitive pricing
    /// Perfect for small to medium businesses with professional email requirements
    /// </summary>
    public class ZohoEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ZohoEmailService> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _fromEmail;
        private readonly string _fromName;        private readonly string _baseUrl;
        private readonly string _accountId;

        public ZohoEmailService(
            IConfiguration configuration,
            ILogger<ZohoEmailService> logger,
            HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;
            _apiKey = _configuration["Zoho:ApiKey"] ?? "";
            _fromEmail = _configuration["Zoho:FromEmail"] ?? _configuration["Email:Sender"] ?? "";
            _fromName = _configuration["Zoho:FromName"] ?? "Sun Movement Fitness Center";            _baseUrl = _configuration["Zoho:BaseUrl"] ?? "https://www.mail.zoho.com/api";
            _accountId = _configuration["Zoho:AccountId"] ?? "";

            // Configure HttpClient for Zoho Mail API
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Zoho-oauthtoken {_apiKey}");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "SunMovement/1.0");
        }

        public async Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName)
        {
            try
            {
                var subject = "🌟 Xác thực email đăng ký - Sun Movement Fitness Center";
                var htmlContent = GenerateVerificationEmailTemplate(firstName, verificationCode);
                var plainTextContent = GenerateVerificationPlainText(firstName, verificationCode);

                return await SendEmailViaZohoAsync(email, subject, htmlContent, plainTextContent);
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

                return await SendEmailViaZohoAsync(email, subject, htmlContent, plainTextContent);
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

                return await SendEmailViaZohoAsync(email, subject, htmlContent, plainTextContent);
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

                await SendEmailViaZohoAsync(to, subject, htmlContent, plainTextContent);
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

                    await SendEmailViaZohoAsync(order.Email, subject, htmlContent, plainTextContent);
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

                await SendEmailViaZohoAsync(to, subject, htmlContent, plainTextContent);
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

                    await SendEmailViaZohoAsync(adminEmail, subject, htmlContent, plainTextContent);
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

                await SendEmailViaZohoAsync(to, emailSubject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact response to {Email}", to);
            }
        }        private async Task<bool> SendEmailViaZohoAsync(string to, string subject, string htmlContent, string plainTextContent)
        {
            try
            {
                // Validate configuration
                if (string.IsNullOrEmpty(_apiKey))
                {
                    _logger.LogError("Zoho API key is not configured");
                    return false;
                }

                if (string.IsNullOrEmpty(_fromEmail))
                {
                    _logger.LogError("From email is not configured");
                    return false;
                }

                if (string.IsNullOrEmpty(_accountId))
                {
                    _logger.LogError("Zoho Account ID is not configured");
                    return false;
                }

                // Prepare Zoho Mail API payload according to official documentation
                var emailData = new
                {
                    fromAddress = _fromEmail,
                    toAddress = to,
                    ccAddress = "",
                    bccAddress = "",
                    subject = subject,
                    content = htmlContent,
                    mailFormat = "html",
                    charset = "UTF-8"
                };

                var json = JsonSerializer.Serialize(emailData, new JsonSerializerOptions 
                { 
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
                });
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Use correct Zoho Mail API endpoint
                var endpoint = $"{_baseUrl}/accounts/{_accountId}/messages";
                var response = await _httpClient.PostAsync(endpoint, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation("Email sent successfully via Zoho Mail to {Email} with subject: {Subject}. Response: {Response}", 
                        to, subject, responseContent);
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Zoho Mail API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
                    
                    // Handle specific Zoho error codes
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        _logger.LogError("Zoho API authentication failed. Check your API key and OAuth token.");
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                    {
                        _logger.LogError("Zoho API access forbidden. Check your account permissions and Account ID.");
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                    {
                        _logger.LogError("Zoho API bad request. Check your email format and required fields.");
                    }
                    
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception sending email via Zoho Mail to {Email}: {Message}", to, ex.Message);
                return false;
            }
        }

        #region Email Templates

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
        .powered-by {{ margin-top: 10px; font-size: 10px; color: #95a5a6; }}
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
            
            <div style='margin-top: 30px; padding: 15px; background-color: #ecf0f1; border-radius: 5px;'>
                <p><strong>Lợi ích thành viên Sun Movement:</strong></p>
                <ul>
                    <li>💪 Đặt lịch tập gym với HLV chuyên nghiệp</li>
                    <li>🏃‍♀️ Tham gia các lớp fitness group</li>
                    <li>🛒 Ưu đãi thiết bị thể thao</li>
                    <li>📰 Bài viết sức khỏe & dinh dưỡng</li>
                </ul>
            </div>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement Fitness Center. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không reply.</p>
            <div class='powered-by'>Powered by Zoho Mail - Professional Business Email</div>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateVerificationPlainText(string firstName, string verificationCode)
        {
            return $@"Sun Movement Fitness Center - Xác thực email

Xin chào {firstName}!

Cảm ơn bạn đã đăng ký tài khoản tại Sun Movement Fitness Center. 

Mã OTP xác thực của bạn: {verificationCode}
Mã có hiệu lực trong 15 phút.

Vui lòng nhập mã này để hoàn tất đăng ký.
Không chia sẻ mã này với bất kỳ ai.

Trân trọng,
Sun Movement Team

Powered by Zoho Mail";
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
        .header {{ background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ padding: 30px; background-color: #f9f9f9; }}
        .feature {{ background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #f39c12; }}
        .button {{ display: inline-block; background: #f39c12; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Chào mừng {firstName}!</h1>
            <p>Tài khoản của bạn đã được kích hoạt thành công</p>
        </div>
        <div class='content'>
            <h2>Bắt đầu hành trình fitness của bạn!</h2>
            <p>Chúc mừng bạn đã trở thành thành viên của <strong>Sun Movement Fitness Center</strong>.</p>
            
            <div class='feature'>
                <h3>💪 Đặt lịch tập gym</h3>
                <p>Đặt lịch tập với HLV cá nhân hoặc tham gia các lớp group fitness</p>
            </div>
            
            <div class='feature'>
                <h3>🛒 Mua sắm thiết bị</h3>
                <p>Khám phá cửa hàng thiết bị thể thao với giá ưu đãi cho thành viên</p>
            </div>
            
            <div style='text-align: center;'>
                <a href='#' class='button'>Khám phá ngay</a>
            </div>
        </div>
        <div class='footer'>
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
            <p>© 2025 Sun Movement Fitness Center</p>
            <p><small>Powered by Zoho Mail</small></p>
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
        .button {{ display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .warning {{ background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; }}
        .footer {{ text-align: center; padding: 20px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔐 Đặt lại mật khẩu</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {firstName}!</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Sun Movement của bạn.</p>
            
            <div style='text-align: center;'>
                <a href='{resetUrl}' class='button'>Đặt lại mật khẩu</a>
            </div>
            
            <div class='warning'>
                <h3>⚠️ Lưu ý quan trọng:</h3>
                <ul>
                    <li>Link này có hiệu lực trong <strong>30 phút</strong></li>
                    <li>Chỉ sử dụng link này nếu bạn đã yêu cầu đặt lại mật khẩu</li>
                    <li>Nếu không phải bạn, vui lòng bỏ qua email này</li>
                </ul>
            </div>
        </div>
        <div class='footer'>
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
            <p>© 2025 Sun Movement Fitness Center</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateOrderConfirmationTemplate(string orderNumber, decimal totalAmount)
        {
            return $@"<div>📦 Đơn hàng #{orderNumber} đã được xác nhận. Tổng tiền: {totalAmount:C}</div>";
        }

        private string GenerateOrderStatusUpdateTemplate(string orderNumber, string status)
        {
            return $@"<div>📋 Đơn hàng #{orderNumber} đã được cập nhật: {status}</div>";
        }

        private string GenerateShippingConfirmationTemplate(string orderNumber, string trackingNumber)
        {
            return $@"<div>🚚 Đơn hàng #{orderNumber} đã được giao. Mã tracking: {trackingNumber}</div>";
        }

        private string GenerateContactNotificationTemplate(ContactMessage message)
        {
            return $@"<div>📞 Liên hệ từ: {message.Name} ({message.Email})<br>Nội dung: {message.Message}</div>";
        }

        private string GenerateContactResponseTemplate(string message)
        {
            return $@"<div>💬 {message}</div>";
        }

        #endregion
    }
}
