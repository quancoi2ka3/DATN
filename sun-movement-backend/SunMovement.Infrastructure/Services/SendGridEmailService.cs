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
    /// Professional Email Service using SendGrid for production scalability
    /// Supports thousands of emails per day with high delivery rate
    /// </summary>
    public class SendGridEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SendGridEmailService> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public SendGridEmailService(
            IConfiguration configuration, 
            ILogger<SendGridEmailService> logger,
            HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;
            _apiKey = _configuration["SendGrid:ApiKey"] ?? "";
            _fromEmail = _configuration["SendGrid:FromEmail"] ?? _configuration["Email:Sender"] ?? "";
            _fromName = _configuration["SendGrid:FromName"] ?? "Sun Movement Fitness Center";

            // Configure HttpClient for SendGrid API
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "SunMovement/1.0");
        }

        public async Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName)
        {
            try
            {
                var subject = "🌟 Xác thực email đăng ký - Sun Movement Fitness Center";
                var htmlContent = GenerateVerificationEmailTemplate(firstName, verificationCode);
                var plainTextContent = GenerateVerificationPlainText(firstName, verificationCode);

                return await SendEmailViaSendGridAsync(email, subject, htmlContent, plainTextContent);
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

                return await SendEmailViaSendGridAsync(email, subject, htmlContent, plainTextContent);
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

                return await SendEmailViaSendGridAsync(email, subject, htmlContent, plainTextContent);
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

                await SendEmailViaSendGridAsync(to, subject, htmlContent, plainTextContent);
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

                    await SendEmailViaSendGridAsync(order.Email, subject, htmlContent, plainTextContent);
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

                await SendEmailViaSendGridAsync(to, subject, htmlContent, plainTextContent);
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

                    await SendEmailViaSendGridAsync(adminEmail, subject, htmlContent, plainTextContent);
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

                await SendEmailViaSendGridAsync(to, emailSubject, htmlContent, plainTextContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact response to {Email}", to);
            }
        }

        private async Task<bool> SendEmailViaSendGridAsync(string to, string subject, string htmlContent, string plainTextContent)
        {
            try
            {
                // Validate configuration
                if (string.IsNullOrEmpty(_apiKey) || _apiKey.StartsWith("SG.") == false)
                {
                    _logger.LogError("SendGrid API key is not configured or invalid");
                    return false;
                }

                if (string.IsNullOrEmpty(_fromEmail))
                {
                    _logger.LogError("From email is not configured");
                    return false;
                }

                // Prepare SendGrid API payload
                var emailData = new
                {
                    personalizations = new[]
                    {
                        new
                        {
                            to = new[] { new { email = to } },
                            subject = subject
                        }
                    },
                    from = new { email = _fromEmail, name = _fromName },
                    content = new[]
                    {
                        new { type = "text/plain", value = plainTextContent },
                        new { type = "text/html", value = htmlContent }
                    },
                    tracking_settings = new
                    {
                        click_tracking = new { enable = true },
                        open_tracking = new { enable = true }
                    }
                };

                var json = JsonSerializer.Serialize(emailData, new JsonSerializerOptions 
                { 
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
                });
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Send via SendGrid API
                var response = await _httpClient.PostAsync("https://api.sendgrid.com/v3/mail/send", content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Email sent successfully via SendGrid to {Email} with subject: {Subject}", to, subject);
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("SendGrid API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception sending email via SendGrid to {Email}: {Message}", to, ex.Message);
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
        .button {{ display: inline-block; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }}
        .footer {{ background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }}
        .social-links {{ margin: 15px 0; }}
        .social-links a {{ color: #f39c12; text-decoration: none; margin: 0 10px; }}
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
            
            <p><strong>Hướng dẫn:</strong></p>
            <ol>
                <li>Quay lại trang đăng ký</li>
                <li>Nhập mã OTP: <strong>{verificationCode}</strong></li>
                <li>Hoàn tất kích hoạt tài khoản</li>
            </ol>
            
            <p><strong>⚠️ Lưu ý bảo mật:</strong></p>
            <ul>
                <li>Không chia sẻ mã OTP với bất kỳ ai</li>
                <li>Mã chỉ có hiệu lực trong 15 phút</li>
                <li>Nếu không phải bạn đăng ký, vui lòng bỏ qua email này</li>
            </ul>
            
            <div style='text-align: center; margin: 30px 0;'>
                <p>Sau khi xác thực thành công, bạn sẽ có thể:</p>
                <p>💪 Đặt lịch tập gym<br>🏃‍♀️ Tham gia các lớp fitness<br>🛒 Mua sắm thiết bị thể thao<br>📰 Đọc bài viết sức khỏe</p>
            </div>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement Fitness Center. All rights reserved.</p>
            <div class='social-links'>
                <a href='#'>Facebook</a> | 
                <a href='#'>Instagram</a> | 
                <a href='#'>Website</a>
            </div>
            <p>Email này được gửi tự động, vui lòng không reply.</p>
            <p>Nếu cần hỗ trợ, hãy liên hệ: support@sunmovement.com</p>
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

Mã có hiệu lực trong 15 phút. Vui lòng nhập mã này để hoàn tất đăng ký.

Không chia sẻ mã này với bất kỳ ai.

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
            <p>Chúc mừng bạn đã trở thành thành viên của <strong>Sun Movement Fitness Center</strong>. Dưới đây là những gì bạn có thể làm:</p>
            
            <div class='feature'>
                <h3>💪 Đặt lịch tập gym</h3>
                <p>Đặt lịch tập với HLV cá nhân hoặc tham gia các lớp group fitness</p>
            </div>
            
            <div class='feature'>
                <h3>🛒 Mua sắm thiết bị</h3>
                <p>Khám phá cửa hàng thiết bị thể thao với giá ưu đãi cho thành viên</p>
            </div>
            
            <div class='feature'>
                <h3>📰 Bài viết sức khỏe</h3>
                <p>Đọc các bài viết về dinh dưỡng, tập luyện và lối sống lành mạnh</p>
            </div>
            
            <div style='text-align: center;'>
                <a href='#' class='button'>Khám phá ngay</a>
            </div>
            
            <p>Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!</p>
        </div>
        <div class='footer'>
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
            <p>© 2025 Sun Movement Fitness Center</p>
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
            
            <p>Nếu nút không hoạt động, copy link sau vào trình duyệt:</p>
            <p style='word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;'>{resetUrl}</p>
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
            return $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <div style='background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 30px; text-align: center;'>
        <h1>📦 Xác nhận đơn hàng</h1>
        <p>Đơn hàng #{orderNumber}</p>
    </div>
    <div style='padding: 30px; background-color: #f9f9f9;'>
        <h2>Cảm ơn bạn đã mua sắm!</h2>
        <p>Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
        <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
            <p><strong>Mã đơn hàng:</strong> #{orderNumber}</p>
            <p><strong>Tổng tiền:</strong> {totalAmount:C}</p>
            <p><strong>Trạng thái:</strong> Đang xử lý</p>
        </div>
        <p>Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.</p>
    </div>
</div>";
        }

        private string GenerateOrderStatusUpdateTemplate(string orderNumber, string status)
        {
            return $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <div style='background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 30px; text-align: center;'>
        <h1>📋 Cập nhật đơn hàng</h1>
    </div>
    <div style='padding: 30px; background-color: #f9f9f9;'>
        <h2>Đơn hàng #{orderNumber} đã được cập nhật</h2>
        <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
            <p><strong>Trạng thái mới:</strong> {status}</p>
        </div>
        <p>Cảm ơn bạn đã mua sắm tại Sun Movement!</p>
    </div>
</div>";
        }

        private string GenerateShippingConfirmationTemplate(string orderNumber, string trackingNumber)
        {
            return $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <div style='background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center;'>
        <h1>🚚 Đơn hàng đã được giao</h1>
    </div>
    <div style='padding: 30px; background-color: #f9f9f9;'>
        <h2>Đơn hàng #{orderNumber} đang trên đường giao đến bạn!</h2>
        <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
            <p><strong>Mã tracking:</strong> {trackingNumber}</p>
        </div>
        <p>Bạn có thể theo dõi đơn hàng bằng mã tracking trên.</p>
    </div>
</div>";
        }

        private string GenerateContactNotificationTemplate(ContactMessage message)
        {
            return $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <div style='background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 30px; text-align: center;'>
        <h1>📞 Liên hệ mới từ website</h1>
    </div>
    <div style='padding: 30px; background-color: #f9f9f9;'>
        <div style='background-color: white; padding: 20px; border-radius: 5px;'>
            <p><strong>Từ:</strong> {message.Name}</p>
            <p><strong>Email:</strong> {message.Email}</p>
            <p><strong>Phone:</strong> {message.Phone}</p>
            <p><strong>Chủ đề:</strong> {message.Subject}</p>
            <p><strong>Nội dung:</strong></p>
            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px;'>
                {message.Message.Replace(Environment.NewLine, "<br>")}
            </div>
        </div>
    </div>
</div>";
        }

        private string GenerateContactResponseTemplate(string message)
        {
            return $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <div style='background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center;'>
        <h1>💬 Phản hồi từ Sun Movement</h1>
    </div>
    <div style='padding: 30px; background-color: #f9f9f9;'>
        <h2>Cảm ơn bạn đã liên hệ!</h2>
        <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
            {message.Replace(Environment.NewLine, "<br>")}
        </div>
        <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
    </div>
</div>";
        }

        #endregion
    }
}
