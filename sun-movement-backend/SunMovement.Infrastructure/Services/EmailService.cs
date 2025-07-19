using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }        public async Task SendOrderConfirmationAsync(Order order)
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
            var subject = $"Xác nhận đơn hàng #{orderNumber} - Sun Movement Fitness Center";
            var body = $@"
                <h2>Cảm ơn bạn đã đặt hàng!</h2>
                <p>Đơn hàng #{orderNumber} của bạn đã được nhận và đang được xử lý.</p>
                <p>Tổng tiền: {totalAmount:N0} VNĐ</p>
                <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
                <p>Cảm ơn bạn đã mua sắm tại Sun Movement!</p>
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
            var subject = $"Cập nhật trạng thái đơn hàng #{order.Id} - Sun Movement Fitness Center";
            var body = $@"
                <h2>Trạng thái đơn hàng của bạn đã được cập nhật</h2>
                <p>Đơn hàng #{order.Id} của bạn đã được cập nhật trạng thái: {order.Status}</p>
                <p>Cảm ơn bạn đã mua sắm tại Sun Movement!</p>
            ";
            
            await SendEmailAsync(email, subject, body);
        }

        public async Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber)
        {
            var subject = $"Đơn hàng #{orderNumber} đã được gửi đi - Sun Movement Fitness Center";
            var body = $@"
                <h2>Đơn hàng của bạn đã được gửi đi!</h2>
                <p>Đơn hàng #{orderNumber} của bạn đã được gửi đi và đang trên đường đến bạn.</p>
                <p>Mã vận đơn: {trackingNumber}</p>
                <p>Cảm ơn bạn đã mua sắm tại Sun Movement!</p>
            ";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendContactNotificationAsync(ContactMessage message)
        {
            if (message == null)
            {
                _logger.LogWarning("Cannot send contact notification: message is null");
                return;
            }            var toEmail = _configuration["Email:ContactNotifications"] ?? _configuration["Email:Sender"] ?? "admin@sunmovement.com";
            var subject = $"Biểu mẫu liên hệ mới: {message.Subject} - Sun Movement";
            var body = $@"
                <h2>Biểu mẫu liên hệ mới</h2>
                <p><strong>Từ:</strong> {message.Name} ({message.Email})</p>
                <p><strong>Điện thoại:</strong> {message.Phone}</p>
                <p><strong>Chủ đề:</strong> {message.Subject}</p>
                <p><strong>Tin nhắn:</strong></p>
                <p>{message.Message.Replace(Environment.NewLine, "<br/>")}</p>
                <hr>
                <p>Bạn có thể trả lời tin nhắn này qua bảng điều khiển quản trị.</p>
            ";
            
            await SendEmailAsync(toEmail, subject, body);
        }        public async Task SendContactResponseAsync(string to, string subject, string message)
        {
            if (string.IsNullOrEmpty(to))
            {
                _logger.LogWarning("Cannot send contact response: recipient email is empty");
                return;
            }

            var emailSubject = $"Re: {subject} - Sun Movement Fitness Center";
            var body = $@"
                <h2>Cảm ơn bạn đã liên hệ với chúng tôi!</h2>
                <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                <p>Tin nhắn của bạn: {message}</p>
                <p>Trân trọng,<br/>Đội ngũ Sun Movement</p>
            ";
            
            await SendEmailAsync(to, emailSubject, body);
        }        public async Task<bool> SendVerificationCodeAsync(string email, string verificationCode, string firstName)
        {
            try
            {
                var subject = "🌟 Xác thực email đăng ký - Sun Movement Fitness Center";
                var body = GenerateVerificationEmailBody(firstName, verificationCode);

                var emailSent = await SendEmailAsync(email, subject, body);
                if (emailSent)
                {
                    _logger.LogInformation("Verification email sent successfully to {Email}", email);
                    return true;
                }
                else
                {
                    _logger.LogWarning("Failed to send verification email to {Email} - SMTP configuration issue", email);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending verification email to {Email}: {Message}", email, ex.Message);
                return false;
            }
        }

        public async Task<bool> SendWelcomeEmailAsync(string email, string firstName)
        {
            try
            {
                var subject = "Chào mừng bạn đến với Sun Movement!";
                var body = GenerateWelcomeEmailBody(firstName);

                await SendEmailAsync(email, subject, body);
                return true;
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
                var subject = "Đặt lại mật khẩu - Sun Movement";
                var body = GeneratePasswordResetEmailBody(firstName, resetUrl);

                await SendEmailAsync(email, subject, body);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendOtpEmailAsync(string email, string otpCode, string purpose)
        {
            try
            {
                var subject = GetOtpEmailSubject(purpose);
                var body = GenerateOtpEmailBody(otpCode, purpose);

                await SendEmailAsync(email, subject, body);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP email to {Email} for purpose {Purpose}", email, purpose);
                return false;
            }
        }

        private string GetOtpEmailSubject(string purpose)
        {
            return purpose switch
            {
                "change-password" => "Mã xác thực đổi mật khẩu - Sun Movement",
                _ => "Mã xác thực OTP - Sun Movement"
            };
        }

        private string GenerateOtpEmailBody(string otpCode, string purpose)
        {
            var title = purpose switch
            {
                "change-password" => "Xác thực đổi mật khẩu",
                _ => "Xác thực OTP"
            };

            var message = purpose switch
            {
                "change-password" => "Bạn đã yêu cầu đổi mật khẩu. Để tiếp tục, vui lòng sử dụng mã xác thực bên dưới:",
                _ => "Bạn đã yêu cầu mã xác thực OTP. Vui lòng sử dụng mã bên dưới:"
            };

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f39c12; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .code {{ font-size: 28px; font-weight: bold; color: #e74c3c; text-align: center; margin: 20px 0; padding: 20px; background-color: #fff; border: 2px dashed #e74c3c; border-radius: 8px; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
        .warning {{ background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌟 Sun Movement</h1>
        </div>
        <div class='content'>
            <h2>{title}</h2>
            <p>{message}</p>
            
            <div class='code'>{otpCode}</div>
            
            <div class='warning'>
                <p><strong>⚠️ Lưu ý quan trọng:</strong></p>
                <ul>
                    <li>Mã xác thực này có hiệu lực trong <strong>10 phút</strong></li>
                    <li>Không chia sẻ mã này với bất kỳ ai</li>
                    <li>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này</li>
                </ul>
            </div>
            
            <p>Nếu bạn gặp bất kỳ khó khăn nào, vui lòng liên hệ với chúng tôi qua email hỗ trợ.</p>
            
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateVerificationEmailBody(string firstName, string verificationCode)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f39c12; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .code {{ font-size: 24px; font-weight: bold; color: #e74c3c; text-align: center; margin: 20px 0; padding: 15px; background-color: #fff; border: 2px dashed #e74c3c; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌟 Sun Movement</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {firstName}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Sun Movement. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực bên dưới:</p>
            
            <div class='code'>{verificationCode}</div>
            
            <p><strong>Lưu ý quan trọng:</strong></p>
            <ul>
                <li>Mã xác thực này có hiệu lực trong <strong>10 phút</strong></li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này</li>
            </ul>
            
            <p>Nếu bạn gặp bất kỳ khó khăn nào, vui lòng liên hệ với chúng tôi qua email hỗ trợ.</p>
            
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateWelcomeEmailBody(string firstName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #27ae60; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .feature {{ background-color: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #27ae60; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Chào mừng đến với Sun Movement!</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {firstName}!</h2>
            <p>Chúc mừng! Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể bắt đầu khám phá các dịch vụ tuyệt vời của chúng tôi:</p>
            
            <div class='feature'>
                <h3>🏃‍♂️ Tham gia các lớp học thể dục</h3>
                <p>Đăng ký các lớp học phù hợp với lịch trình của bạn</p>
            </div>
            
            <div class='feature'>
                <h3>🛒 Mua sắm sản phẩm thể thao</h3>
                <p>Khám phá các sản phẩm thể thao chất lượng cao</p>
            </div>
            
            <div class='feature'>
                <h3>👥 Kết nối cộng đồng</h3>
                <p>Tham gia cộng đồng yêu thích thể thao và sức khỏe</p>
            </div>
            
            <p>Cảm ơn bạn đã tin tưởng và lựa chọn Sun Movement!</p>
            
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GeneratePasswordResetEmailBody(string firstName, string resetUrl)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #e74c3c; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .button {{ display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔒 Sun Movement</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {firstName}!</h2>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
            
            <div style='text-align: center;'>
                <a href='{resetUrl}' class='button'>Đặt lại mật khẩu</a>
            </div>
            
            <p><strong>Lưu ý quan trọng:</strong></p>
            <ul>
                <li>Liên kết này có hiệu lực trong <strong>30 phút</strong></li>
                <li>Nếu nút không hoạt động, copy link sau vào trình duyệt: {resetUrl}</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
            </ul>
            
            <p>Trân trọng,<br>Đội ngũ Sun Movement</p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";
        }        private async Task<bool> SendEmailAsync(string to, string subject, string htmlBody)
        {
            if (string.IsNullOrEmpty(to))
            {
                _logger.LogWarning("Cannot send email: recipient email is empty");
                return false;
            }

            try
            {
                var fromEmail = _configuration["Email:Sender"] ?? "noreply@sunmovement.com";
                var fromName = "Sun Movement Fitness Center";
                var smtpServer = _configuration["Email:SmtpServer"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["Email:Username"];
                var smtpPassword = _configuration["Email:Password"];

                // Debug logging
                _logger.LogInformation("📧 Email Configuration Debug:");
                _logger.LogInformation("  From Email: {FromEmail}", fromEmail);
                _logger.LogInformation("  SMTP Server: {SmtpServer}", smtpServer);
                _logger.LogInformation("  SMTP Port: {SmtpPort}", smtpPort);
                _logger.LogInformation("  SMTP Username: {SmtpUsername}", smtpUsername);
                _logger.LogInformation("  SMTP Password: {HasPassword}", !string.IsNullOrEmpty(smtpPassword));
                _logger.LogInformation("  To Email: {ToEmail}", to);
                _logger.LogInformation("  Subject: {Subject}", subject);

                // Check for SMTP configuration
                if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    _logger.LogError("SMTP configuration is incomplete. Missing: Server={Server}, Username={Username}, Password={HasPassword}", 
                        string.IsNullOrEmpty(smtpServer) ? "MISSING" : "OK", 
                        string.IsNullOrEmpty(smtpUsername) ? "MISSING" : "OK",
                        string.IsNullOrEmpty(smtpPassword) ? "MISSING" : "OK");
                        
                    _logger.LogError("Current SMTP values: Server='{Server}', Username='{Username}', Port={Port}", 
                        smtpServer ?? "NULL", 
                        smtpUsername ?? "NULL", 
                        smtpPort);
                    return false;
                }

                // Check for placeholder values
                if (smtpServer == "smtp.example.com" || smtpUsername == "your-username" || smtpPassword == "your-password" ||
                    smtpUsername.Contains("YOUR_") || smtpPassword.Contains("YOUR_"))
                {
                    _logger.LogError("SMTP configuration contains placeholder values. Please configure real SMTP settings.");
                    _logger.LogError("Found placeholder values: Server='{Server}', Username='{Username}'", smtpServer, smtpUsername);
                    return false;
                }

                var mail = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                mail.To.Add(new MailAddress(to));

                _logger.LogInformation("📧 Attempting to send email via SMTP...");
                using var client = new SmtpClient(smtpServer, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true
                };

                await client.SendMailAsync(mail);
                _logger.LogInformation("✅ Email sent successfully to {To} with subject: {Subject}", to, subject);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error sending email to {To}. Error: {Message}", to, ex.Message);
                return false;
            }
        }

        // ================== COUPON EMAIL METHODS ==================

        public async Task<bool> SendCouponEmailAsync(string email, string customerName, Coupon coupon, string campaignType = "general")
        {
            try
            {
                var subject = GenerateCouponEmailSubject(coupon, campaignType);
                var body = GenerateCouponEmailBody(customerName, coupon, campaignType);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendCouponCampaignEmailAsync(string email, string customerName, IEnumerable<Coupon> coupons, string campaignName, string campaignDescription)
        {
            try
            {
                var subject = $"🎉 {campaignName} - Ưu đãi đặc biệt dành cho bạn!";
                var body = GenerateCouponCampaignEmailBody(customerName, coupons, campaignName, campaignDescription);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending coupon campaign email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendWelcomeCouponEmailAsync(string email, string customerName, Coupon welcomeCoupon)
        {
            try
            {
                var subject = "🎁 Chào mừng bạn đến với Sun Movement - Nhận ngay mã giảm giá!";
                var body = GenerateWelcomeCouponEmailBody(customerName, welcomeCoupon);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending welcome coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendSeasonalCouponEmailAsync(string email, string customerName, Coupon seasonalCoupon, string occasion)
        {
            try
            {
                var subject = $"🌟 Ưu đãi {occasion} đặc biệt - Mã giảm giá {seasonalCoupon.Code}";
                var body = GenerateSeasonalCouponEmailBody(customerName, seasonalCoupon, occasion);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending seasonal coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendBirthdayCouponEmailAsync(string email, string customerName, Coupon birthdayCoupon)
        {
            try
            {
                var subject = "🎂 Chúc mừng sinh nhật - Quà tặng đặc biệt từ Sun Movement!";
                var body = GenerateBirthdayCouponEmailBody(customerName, birthdayCoupon);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending birthday coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendAbandonedCartCouponEmailAsync(string email, string customerName, Coupon coupon, decimal cartValue)
        {
            try
            {
                var subject = "🛒 Bạn quên hoàn tất đơn hàng - Nhận ngay ưu đãi 🎁";
                var body = GenerateAbandonedCartCouponEmailBody(customerName, coupon, cartValue);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending abandoned cart coupon email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendCustomerLoyaltyCouponEmailAsync(string email, string customerName, Coupon loyaltyCoupon, int orderCount, decimal totalSpent)
        {
            try
            {
                var subject = "💎 Cảm ơn khách hàng thân thiết - Ưu đãi đặc biệt dành riêng cho bạn!";
                var body = GenerateCustomerLoyaltyCouponEmailBody(customerName, loyaltyCoupon, orderCount, totalSpent);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending loyalty coupon email to {Email}", email);
                return false;
            }
        }

        // ================== HELPER METHODS FOR COUPON EMAILS ==================

        private string GenerateCouponEmailSubject(Coupon coupon, string campaignType)
        {
            return campaignType switch
            {
                "welcome" => "🎁 Chào mừng bạn đến với Sun Movement - Nhận ngay mã giảm giá!",
                "seasonal" => $"🌟 Ưu đãi mùa đặc biệt - Mã giảm giá {coupon.Code}",
                "birthday" => "🎂 Chúc mừng sinh nhật - Quà tặng đặc biệt từ Sun Movement!",
                "loyalty" => "💎 Cảm ơn khách hàng thân thiết - Ưu đãi đặc biệt!",
                "abandoned_cart" => "🛒 Bạn quên hoàn tất đơn hàng - Nhận ngay ưu đãi 🎁",
                _ => $"🎉 Mã giảm giá {coupon.Code} - Ưu đãi đặc biệt cho bạn!"
            };
        }

        private string GenerateCouponEmailBody(string customerName, Coupon coupon, string campaignType)
        {
            var discountText = coupon.Type switch
            {
                CouponType.Percentage => $"{coupon.Value:0.##}%",
                CouponType.FixedAmount => $"{coupon.Value:N0} VNĐ",
                CouponType.FreeShipping => "miễn phí vận chuyển",
                _ => coupon.Value.ToString("N0")
            };

            var campaignTitle = campaignType switch
            {
                "welcome" => "Chào mừng bạn đến với Sun Movement!",
                "seasonal" => "Ưu đãi mùa đặc biệt",
                "birthday" => "Chúc mừng sinh nhật!",
                "loyalty" => "Cảm ơn khách hàng thân thiết",
                "abandoned_cart" => "Hoàn tất đơn hàng của bạn",
                _ => "Ưu đãi đặc biệt"
            };

            var campaignMessage = campaignType switch
            {
                "welcome" => "Cảm ơn bạn đã gia nhập cộng đồng Sun Movement! Để chào mừng bạn, chúng tôi tặng bạn mã giảm giá đặc biệt:",
                "seasonal" => "Nhân dịp mùa lễ hội, Sun Movement gửi tặng bạn ưu đãi đặc biệt:",
                "birthday" => "Chúc mừng sinh nhật bạn! Sun Movement gửi tặng món quà đặc biệt:",
                "loyalty" => "Cảm ơn bạn đã đồng hành cùng Sun Movement. Đây là ưu đãi đặc biệt dành riêng cho bạn:",
                "abandoned_cart" => "Bạn có sản phẩm trong giỏ hàng chưa hoàn tất. Hãy sử dụng mã giảm giá này để tiết kiệm hơn:",
                _ => "Sun Movement gửi tặng bạn mã giảm giá đặc biệt:"
            };

            var minOrderText = coupon.MinimumOrderAmount > 0 ? 
                $"<li>Đơn hàng tối thiểu: <strong>{coupon.MinimumOrderAmount:N0} VNĐ</strong></li>" : "";

            var usageLimitText = coupon.UsageLimit > 0 ? 
                $"<li>Số lượng có hạn: chỉ <strong>{coupon.UsageLimit}</strong> lượt sử dụng</li>" : "";

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px 20px; text-align: center; }}
        .content {{ padding: 30px 20px; }}
        .coupon-box {{ background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 25px; margin: 25px 0; border-radius: 10px; text-align: center; border: 3px dashed #fff; }}
        .coupon-code {{ font-size: 32px; font-weight: bold; letter-spacing: 3px; margin: 15px 0; font-family: 'Courier New', monospace; }}
        .coupon-value {{ font-size: 24px; margin: 10px 0; }}
        .coupon-desc {{ font-size: 16px; margin: 10px 0; opacity: 0.9; }}
        .conditions {{ background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }}
        .cta-button {{ display: inline-block; background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; font-size: 18px; }}
        .footer {{ background-color: #34495e; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px; }}
        .highlight {{ color: #e74c3c; font-weight: bold; }}
        .products {{ display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }}
        .product {{ flex: 1; min-width: 150px; text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌟 Sun Movement</h1>
            <h2>{campaignTitle}</h2>
        </div>
        <div class='content'>
            <h2>Xin chào {customerName}!</h2>
            
            <p>{campaignMessage}</p>
            
            <div class='coupon-box'>
                <div class='coupon-desc'>{coupon.Description}</div>
                <div class='coupon-code'>{coupon.Code}</div>
                <div class='coupon-value'>GIẢM {discountText}</div>
                <div style='font-size: 14px; margin-top: 15px;'>
                    Có hiệu lực đến: <strong>{coupon.EndDate:dd/MM/yyyy}</strong>
                </div>
            </div>
            
            <div class='conditions'>
                <h3>📋 Điều kiện áp dụng:</h3>
                <ul>
                    {minOrderText}
                    <li>Có hiệu lực từ <strong>{coupon.StartDate:dd/MM/yyyy}</strong> đến <strong>{coupon.EndDate:dd/MM/yyyy}</strong></li>
                    {usageLimitText}
                    <li>Không áp dụng đồng thời với các ưu đãi khác</li>
                    <li>Áp dụng cho tất cả sản phẩm trên website</li>
                </ul>
            </div>
            
            <div style='text-align: center;'>
                <a href='https://sunmovement.vn/products' class='cta-button'>
                    🛒 MUA SẮM NGAY
                </a>
            </div>
            
            <div class='products'>
                <div class='product'>
                    <h4>🏃‍♂️ Giày thể thao</h4>
                    <p>Giày chạy bộ, tập gym chất lượng cao</p>
                </div>
                <div class='product'>
                    <h4>👕 Trang phục thể thao</h4>
                    <p>Áo quần tập luyện thoáng mát</p>
                </div>
                <div class='product'>
                    <h4>🏋️‍♂️ Thiết bị tập luyện</h4>
                    <p>Dụng cụ tập gym tại nhà</p>
                </div>
            </div>
            
            <h3>🔥 Cách sử dụng mã giảm giá:</h3>
            <ol>
                <li>Thêm sản phẩm yêu thích vào giỏ hàng</li>
                <li>Tại trang thanh toán, nhập mã <strong class='highlight'>{coupon.Code}</strong></li>
                <li>Nhấn ""Áp dụng"" và thưởng thức ưu đãi!</li>
            </ol>
            
            <p><strong>Lưu ý:</strong> Mã giảm giá này chỉ dành riêng cho bạn. Hãy nhanh tay sử dụng trước khi hết hạn!</p>
            
            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua hotline <strong>1900 1234</strong> hoặc email <strong>support@sunmovement.vn</strong></p>
            
            <p>Chúc bạn có những trải nghiệm mua sắm tuyệt vời!</p>
            
            <p>Trân trọng,<br><strong>Đội ngũ Sun Movement</strong></p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>📍 Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
            <p>📞 Hotline: 1900 1234 | 📧 Email: info@sunmovement.vn</p>
            <p><small>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</small></p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateCouponCampaignEmailBody(string customerName, IEnumerable<Coupon> coupons, string campaignName, string campaignDescription)
        {
            var couponList = string.Join("", coupons.Select(coupon => {
                var discountText = coupon.Type switch
                {
                    CouponType.Percentage => $"{coupon.Value:0.##}%",
                    CouponType.FixedAmount => $"{coupon.Value:N0} VNĐ",
                    CouponType.FreeShipping => "Miễn phí ship",
                    _ => coupon.Value.ToString("N0")
                };

                return $@"
                <div class='coupon-item'>
                    <div class='coupon-header'>
                        <h3>{coupon.Name}</h3>
                        <div class='coupon-badge'>GIẢM {discountText}</div>
                    </div>
                    <div class='coupon-code-small'>{coupon.Code}</div>
                    <p>{coupon.Description}</p>
                    <div class='coupon-validity'>
                        Có hiệu lực đến: <strong>{coupon.EndDate:dd/MM/yyyy}</strong>
                    </div>
                </div>";
            }));

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 30px 20px; text-align: center; }}
        .content {{ padding: 30px 20px; }}
        .coupon-item {{ background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 10px; padding: 20px; margin: 15px 0; }}
        .coupon-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }}
        .coupon-badge {{ background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; }}
        .coupon-code-small {{ background-color: #34495e; color: white; padding: 10px; border-radius: 5px; text-align: center; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; margin: 10px 0; }}
        .coupon-validity {{ color: #666; font-size: 14px; text-align: center; }}
        .cta-button {{ display: inline-block; background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; font-size: 18px; }}
        .footer {{ background-color: #34495e; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 {campaignName}</h1>
            <p>{campaignDescription}</p>
        </div>
        <div class='content'>
            <h2>Xin chào {customerName}!</h2>
            
            <p>Chúng tôi vui mừng thông báo chiến dịch ưu đãi đặc biệt dành riêng cho bạn! Hãy tận dụng các mã giảm giá hấp dẫn bên dưới:</p>
            
            {couponList}
            
            <div style='text-align: center; margin: 30px 0;'>
                <a href='https://sunmovement.vn/products' class='cta-button'>
                    🛒 KHÁM PHÁ SẢN PHẨM
                </a>
            </div>
            
            <div style='background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                <h3>⚠️ Lưu ý quan trọng:</h3>
                <ul>
                    <li>Các mã giảm giá chỉ áp dụng trong thời gian có hiệu lực</li>
                    <li>Không áp dụng đồng thời nhiều mã giảm giá</li>
                    <li>Số lượng có hạn, hết là hết!</li>
                </ul>
            </div>
            
            <p>Đừng bỏ lỡ cơ hội tuyệt vời này! Hãy nhanh tay mua sắm để nhận được ưu đãi tốt nhất.</p>
            
            <p>Trân trọng,<br><strong>Đội ngũ Sun Movement</strong></p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>📞 Hotline: 1900 1234 | 📧 Email: info@sunmovement.vn</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateWelcomeCouponEmailBody(string customerName, Coupon welcomeCoupon)
        {
            return GenerateCouponEmailBody(customerName, welcomeCoupon, "welcome");
        }

        private string GenerateSeasonalCouponEmailBody(string customerName, Coupon seasonalCoupon, string occasion)
        {
            return GenerateCouponEmailBody(customerName, seasonalCoupon, "seasonal");
        }

        private string GenerateBirthdayCouponEmailBody(string customerName, Coupon birthdayCoupon)
        {
            return GenerateCouponEmailBody(customerName, birthdayCoupon, "birthday");
        }

        private string GenerateAbandonedCartCouponEmailBody(string customerName, Coupon coupon, decimal cartValue)
        {
            var discountText = coupon.Type switch
            {
                CouponType.Percentage => $"{coupon.Value:0.##}%",
                CouponType.FixedAmount => $"{coupon.Value:N0} VNĐ",
                CouponType.FreeShipping => "miễn phí vận chuyển",
                _ => coupon.Value.ToString("N0")
            };

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #f39c12, #d35400); color: white; padding: 30px 20px; text-align: center; }}
        .content {{ padding: 30px 20px; }}
        .cart-reminder {{ background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }}
        .coupon-box {{ background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 25px; margin: 25px 0; border-radius: 10px; text-align: center; border: 3px dashed #fff; }}
        .coupon-code {{ font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 15px 0; font-family: 'Courier New', monospace; }}
        .cta-button {{ display: inline-block; background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; font-size: 18px; }}
        .footer {{ background-color: #34495e; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🛒 Sun Movement</h1>
            <h2>Đừng để lỡ cơ hội!</h2>
        </div>
        <div class='content'>
            <h2>Xin chào {customerName}!</h2>
            
            <div class='cart-reminder'>
                <h3>🛍️ Bạn có sản phẩm đang chờ trong giỏ hàng</h3>
                <p>Giỏ hàng của bạn có tổng giá trị <strong>{cartValue:N0} VNĐ</strong> đang chờ thanh toán.</p>
                <p>Đừng để những sản phẩm tuyệt vời này bị bỏ lỡ!</p>
            </div>
            
            <p>Để giúp bạn hoàn tất đơn hàng, chúng tôi gửi tặng bạn mã giảm giá đặc biệt:</p>
            
            <div class='coupon-box'>
                <div style='font-size: 18px; margin-bottom: 10px;'>{coupon.Description}</div>
                <div class='coupon-code'>{coupon.Code}</div>
                <div style='font-size: 22px; margin: 10px 0;'>GIẢM {discountText}</div>
                <div style='font-size: 14px; margin-top: 15px;'>
                    Có hiệu lực đến: <strong>{coupon.EndDate:dd/MM/yyyy}</strong>
                </div>
            </div>
            
            <div style='text-align: center;'>
                <a href='https://sunmovement.vn/cart' class='cta-button'>
                    ✅ HOÀN TẤT ĐƠN HÀNG
                </a>
            </div>
            
            <p><strong>⏰ Thời gian có hạn!</strong> Mã giảm giá này chỉ có hiệu lực trong thời gian ngắn. Hãy nhanh tay hoàn tất đơn hàng để không bỏ lỡ ưu đãi tuyệt vời này!</p>
            
            <p>Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
            
            <p>Trân trọng,<br><strong>Đội ngũ Sun Movement</strong></p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>📞 Hotline: 1900 1234 | 📧 Email: info@sunmovement.vn</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateCustomerLoyaltyCouponEmailBody(string customerName, Coupon loyaltyCoupon, int orderCount, decimal totalSpent)
        {
            var discountText = loyaltyCoupon.Type switch
            {
                CouponType.Percentage => $"{loyaltyCoupon.Value:0.##}%",
                CouponType.FixedAmount => $"{loyaltyCoupon.Value:N0} VNĐ",
                CouponType.FreeShipping => "miễn phí vận chuyển",
                _ => loyaltyCoupon.Value.ToString("N0")
            };

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 30px 20px; text-align: center; }}
        .content {{ padding: 30px 20px; }}
        .loyalty-stats {{ background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }}
        .stat-item {{ display: inline-block; margin: 10px 20px; }}
        .stat-number {{ font-size: 28px; font-weight: bold; color: #9b59b6; }}
        .stat-label {{ font-size: 14px; color: #666; }}
        .coupon-box {{ background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 25px; margin: 25px 0; border-radius: 10px; text-align: center; border: 3px solid #f39c12; }}
        .coupon-code {{ font-size: 30px; font-weight: bold; letter-spacing: 3px; margin: 15px 0; font-family: 'Courier New', monospace; color: #f39c12; }}
        .cta-button {{ display: inline-block; background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; font-size: 18px; }}
        .footer {{ background-color: #34495e; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>💎 Sun Movement VIP</h1>
            <h2>Cảm ơn khách hàng thân thiết</h2>
        </div>
        <div class='content'>
            <h2>Xin chào {customerName} - Khách hàng VIP!</h2>
            
            <p>Chúng tôi vô cùng trân trọng sự tin tưởng và đồng hành của bạn với Sun Movement. Bạn là một trong những khách hàng quý giá nhất của chúng tôi!</p>
            
            <div class='loyalty-stats'>
                <h3>📊 Thành tích của bạn tại Sun Movement</h3>
                <div class='stat-item'>
                    <div class='stat-number'>{orderCount}</div>
                    <div class='stat-label'>Đơn hàng</div>
                </div>
                <div class='stat-item'>
                    <div class='stat-number'>{totalSpent:N0}</div>
                    <div class='stat-label'>VNĐ đã chi tiêu</div>
                </div>
            </div>
            
            <p>Để tri ân sự loyal của bạn, chúng tôi gửi tặng mã giảm giá VIP đặc biệt:</p>
            
            <div class='coupon-box'>
                <div style='font-size: 18px; margin-bottom: 10px;'>🏆 MÃ GIẢM GIÁ VIP</div>
                <div style='font-size: 16px; margin-bottom: 15px;'>{loyaltyCoupon.Description}</div>
                <div class='coupon-code'>{loyaltyCoupon.Code}</div>
                <div style='font-size: 24px; margin: 15px 0; color: #f39c12;'>GIẢM {discountText}</div>
                <div style='font-size: 14px; margin-top: 15px;'>
                    Có hiệu lực đến: <strong>{loyaltyCoupon.EndDate:dd/MM/yyyy}</strong>
                </div>
            </div>
            
            <div style='background-color: #e8f5e8; border: 2px solid #27ae60; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3>🎁 Đặc quyền khách hàng VIP:</h3>
                <ul>
                    <li>✨ Ưu tiên hỗ trợ khách hàng 24/7</li>
                    <li>🚚 Miễn phí vận chuyển cho mọi đơn hàng</li>
                    <li>🎯 Nhận thông báo sớm về sản phẩm mới</li>
                    <li>💝 Ưu đãi đặc biệt vào ngày sinh nhật</li>
                    <li>🏅 Tích điểm thưởng cao hơn</li>
                </ul>
            </div>
            
            <div style='text-align: center;'>
                <a href='https://sunmovement.vn/vip-collection' class='cta-button'>
                    👑 XEM BỘ SƯU TẬP VIP
                </a>
            </div>
            
            <p>Một lần nữa, cảm ơn bạn đã tin tưởng và lựa chọn Sun Movement. Chúng tôi cam kết sẽ tiếp tục mang đến cho bạn những sản phẩm và dịch vụ tốt nhất!</p>
            
            <p>Trân trọng và biết ơn,<br><strong>Ban Lãnh Đạo Sun Movement</strong></p>
        </div>
        <div class='footer'>
            <p>© 2025 Sun Movement. All rights reserved.</p>
            <p>VIP Hotline: 1900 1234 | VIP Email: vip@sunmovement.vn</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
