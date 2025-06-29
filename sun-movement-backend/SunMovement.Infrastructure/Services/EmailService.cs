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
            var subject = $"Order Confirmation #{orderNumber} - Sun Movement Fitness Center";
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
            var subject = $"Order Status Update #{order.Id} - Sun Movement Fitness Center";
            var body = $@"
                <h2>Your Order Status Has Been Updated</h2>
                <p>Your order #{order.Id} has been updated to status: {order.Status}</p>
                <p>Thank you for shopping with Sun Movement!</p>
            ";
            
            await SendEmailAsync(email, subject, body);
        }

        public async Task SendShippingConfirmationAsync(string to, string orderNumber, string trackingNumber)
        {
            var subject = $"Your Order #{orderNumber} Has Been Shipped - Sun Movement Fitness Center";
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
            }            var toEmail = _configuration["Email:ContactNotifications"] ?? _configuration["Email:Sender"] ?? "admin@sunmovement.com";
            var subject = $"New Contact Form Submission: {message.Subject} - Sun Movement";
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

            var emailSubject = $"Re: {subject} - Sun Movement Fitness Center";
            var body = $@"
                <h2>Thank you for contacting us!</h2>
                <p>We have received your message and will respond shortly.</p>
                <p>Your message: {message}</p>
                <p>Best regards,<br/>The Sun Movement Team</p>
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
                var smtpPassword = _configuration["Email:Password"];                // Check for SMTP configuration
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

                using var client = new SmtpClient(smtpServer, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true
                };

                await client.SendMailAsync(mail);
                _logger.LogInformation("Email sent successfully to {To} with subject: {Subject}", to, subject);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {To}. Error: {Message}", to, ex.Message);
                return false;
            }
        }
    }
}
