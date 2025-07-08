using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Web.Areas.Api.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/debug")]
    [ApiController]
    public class DebugController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailVerificationService _emailVerificationService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<DebugController> _logger;

        public DebugController(
            UserManager<ApplicationUser> userManager,
            IEmailVerificationService emailVerificationService,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<DebugController> logger)
        {
            _userManager = userManager;
            _emailVerificationService = emailVerificationService;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                message = "Debug controller is working"
            });
        }

        [HttpGet("services")]
        public IActionResult TestServices()
        {
            var services = new
            {
                userManager = _userManager != null,
                emailVerificationService = _emailVerificationService != null,
                emailService = _emailService != null,
                configuration = _configuration != null,
                logger = _logger != null
            };

            return Ok(new
            {
                message = "Service injection test",
                services = services
            });
        }

        [HttpGet("email-config")]
        public IActionResult CheckEmailConfig()
        {
            try
            {
                var emailConfig = new
                {
                    Sender = _configuration["Email:Sender"],
                    SenderName = _configuration["Email:SenderName"],
                    SmtpServer = _configuration["Email:SmtpServer"],
                    SmtpPort = _configuration["Email:SmtpPort"],
                    Username = _configuration["Email:Username"],
                    HasPassword = !string.IsNullOrEmpty(_configuration["Email:Password"]),
                    ContactNotifications = _configuration["Email:ContactNotifications"]
                };

                var issues = new List<string>();
                
                if (string.IsNullOrEmpty(emailConfig.SmtpServer) || emailConfig.SmtpServer == "smtp.example.com")
                    issues.Add("SMTP Server not configured or using placeholder value");
                
                if (string.IsNullOrEmpty(emailConfig.Username) || 
                    emailConfig.Username.Contains("REPLACE_WITH_") || 
                    emailConfig.Username.Contains("YOUR_"))
                    issues.Add("Username not configured or using placeholder value");
                
                if (!emailConfig.HasPassword || 
                    _configuration["Email:Password"]?.Contains("REPLACE_WITH_") == true ||
                    _configuration["Email:Password"]?.Contains("YOUR_") == true)
                    issues.Add("Password not configured or using placeholder value");

                var isValid = issues.Count == 0;

                return Ok(new
                {
                    message = isValid ? "Email configuration is valid" : "Email configuration has issues",
                    isValid = isValid,
                    configuration = emailConfig,
                    issues = issues,
                    recommendation = isValid ?
                        "Email should work properly" :
                        "Please update appsettings.json with real email credentials"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking email configuration");
                return StatusCode(500, new
                {
                    message = "Error checking email configuration",
                    error = ex.Message
                });
            }
        }

        [HttpGet("smtp-config")]
        public IActionResult GetSmtpConfig()
        {
            try
            {
                var config = new
                {
                    SmtpServer = _configuration["Email:SmtpServer"],
                    SmtpPort = _configuration["Email:SmtpPort"],
                    Username = _configuration["Email:Username"],
                    Sender = _configuration["Email:Sender"],
                    SenderName = _configuration["Email:SenderName"],
                    HasPassword = !string.IsNullOrEmpty(_configuration["Email:Password"]),
                    PasswordLength = _configuration["Email:Password"]?.Length ?? 0,
                    IsConfigured = !string.IsNullOrEmpty(_configuration["Email:SmtpServer"]) &&
                                  !string.IsNullOrEmpty(_configuration["Email:Username"]) &&
                                  !string.IsNullOrEmpty(_configuration["Email:Password"]),
                    HasPlaceholders = _configuration["Email:Password"]?.Contains("YOUR_") == true ||
                                     _configuration["Email:Username"]?.Contains("YOUR_") == true
                };

                _logger.LogInformation("SMTP configuration requested - Server: {Server}, Port: {Port}", 
                    config.SmtpServer, config.SmtpPort);

                return Ok(config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting SMTP configuration");
                return StatusCode(500, new { error = "Unable to retrieve SMTP configuration" });
            }
        }

        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
        {
            try
            {
                _logger.LogInformation("Test email requested to: {Email}", request.Email);

                var success = await _emailService.SendVerificationCodeAsync(
                    request.Email, 
                    "123456", 
                    "Test User"
                );

                if (success)
                {
                    _logger.LogInformation("Test email sent successfully to: {Email}", request.Email);
                    return Ok(new { 
                        success = true, 
                        message = "Email thử nghiệm đã được gửi thành công",
                        email = request.Email 
                    });
                }
                else
                {
                    _logger.LogWarning("Failed to send test email to: {Email}", request.Email);
                    return BadRequest(new { 
                        success = false, 
                        message = "Không thể gửi email thử nghiệm. Vui lòng kiểm tra cấu hình SMTP." 
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception sending test email to: {Email}", request.Email);
                return StatusCode(500, new { 
                    success = false, 
                    message = "Đã xảy ra lỗi khi gửi email thử nghiệm",
                    error = ex.Message 
                });
            }
        }

        [HttpPost("test-email-send")]
        public async Task<IActionResult> TestEmailSend([FromBody] TestEmailModel model)
        {
            try
            {
                var emailSent = await _emailService.SendVerificationCodeAsync(
                    model.Email,
                    "123456",
                    "Test User"
                );

                return Ok(new
                {
                    message = emailSent ? "Email đã được gửi thành công!" : "Gửi email thất bại",
                    success = emailSent,
                    testEmail = model.Email,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing email send to {Email}", model.Email);
                return StatusCode(500, new
                {
                    message = "Lỗi khi thử nghiệm gửi email",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        [HttpGet("user-info")]
        public async Task<IActionResult> GetUserInfo([FromQuery] string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { message = "Email is required" });
                }

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var roles = await _userManager.GetRolesAsync(user);
                var hasPasswordHash = !string.IsNullOrEmpty(user.PasswordHash);

                return Ok(new
                {
                    email = user.Email,
                    emailConfirmed = user.EmailConfirmed,
                    isActive = user.IsActive,
                    hasPasswordHash = hasPasswordHash,
                    passwordHashLength = user.PasswordHash?.Length ?? 0,
                    roles = roles,
                    createdAt = user.CreatedAt,
                    lastLogin = user.LastLogin,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    phoneNumber = user.PhoneNumber,
                    lockoutEnabled = user.LockoutEnabled,
                    accessFailedCount = user.AccessFailedCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user info for {Email}", email);
                return StatusCode(500, new { message = "Error retrieving user info", error = ex.Message });
            }
        }

        [HttpGet("system-info")]
        public async Task<IActionResult> GetSystemInfo()
        {
            try
            {
                var totalUsers = _userManager.Users.Count();
                var totalCustomers = 0;
                var allUsers = _userManager.Users.ToList();
                
                foreach (var user in allUsers)
                {
                    if (await _userManager.IsInRoleAsync(user, "Customer"))
                    {
                        totalCustomers++;
                    }
                }

                return Ok(new
                {
                    serverTime = DateTime.UtcNow,
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                    totalUsers = totalUsers,
                    totalCustomers = totalCustomers,
                    databaseConnected = true, // Simplified for now
                    identityConfigured = true,
                    emailService = "MockEmailService"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system info");
                return StatusCode(500, new { message = "Error retrieving system info", error = ex.Message });
            }
        }

        [HttpPost("test-password")]
        public async Task<IActionResult> TestPassword([FromBody] TestPasswordModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);
                
                return Ok(new
                {
                    email = user.Email,
                    passwordValid = isPasswordValid,
                    hasPasswordHash = !string.IsNullOrEmpty(user.PasswordHash),
                    passwordHashLength = user.PasswordHash?.Length ?? 0,
                    passwordHashPrefix = user.PasswordHash?.Substring(0, Math.Min(20, user.PasswordHash.Length )) ?? "N/A"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing password for {Email}", model?.Email);
                return StatusCode(500, new { message = "Error testing password", error = ex.Message });
            }
        }

        [HttpGet("check-verification-data")]
        public async Task<IActionResult> CheckVerificationData([FromQuery] string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { message = "Email is required" });
                }

                var verificationData = await _emailVerificationService.GetVerificationDataAsync(email);
                
                if (verificationData == null)
                {
                    return NotFound(new { message = "No verification data found for this email" });
                }

                return Ok(new
                {
                    email = email,
                    hasFirstName = !string.IsNullOrEmpty(verificationData.FirstName),
                    hasLastName = !string.IsNullOrEmpty(verificationData.LastName),
                    hasPassword = !string.IsNullOrEmpty(verificationData.Password),
                    passwordLength = verificationData.Password?.Length ?? 0,
                    hasDateOfBirth = verificationData.DateOfBirth.HasValue,
                    hasAddress = !string.IsNullOrEmpty(verificationData.Address),
                    hasPhoneNumber = !string.IsNullOrEmpty(verificationData.PhoneNumber),
                    firstName = verificationData.FirstName,
                    lastName = verificationData.LastName
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking verification data for {Email}", email);
                return StatusCode(500, new { message = "Error checking verification data", error = ex.Message });
            }
        }
    }

    public class TestEmailRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}