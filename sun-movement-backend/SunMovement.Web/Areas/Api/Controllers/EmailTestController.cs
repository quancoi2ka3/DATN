using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Api.Controllers
{
    /// <summary>
    /// Email Testing Controller for development and debugging
    /// Provides endpoints to test email functionality
    /// </summary>
    [Area("Api")]
    [Route("api/email")]
    [ApiController]
    public class EmailTestController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailTestController> _logger;

        public EmailTestController(
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<EmailTestController> logger)
        {
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Get current email configuration
        /// </summary>
        [HttpGet("config")]
        public IActionResult GetEmailConfig()
        {
            try
            {
                var config = new
                {
                    Provider = _configuration["Email:Provider"] ?? "not specified",
                    SmtpServer = _configuration["Email:SmtpServer"] ?? "not configured",
                    Sender = _configuration["Email:Sender"] ?? "not specified",
                    SenderName = _configuration["Email:SenderName"] ?? "not specified",
                    SmtpPort = _configuration["Email:SmtpPort"] ?? "not configured",
                    EnableSsl = _configuration["Email:EnableSsl"] ?? "not specified",
                    Status = "Configuration loaded successfully"
                };

                _logger.LogInformation("Email configuration requested - Provider: {Provider}", config.Provider);
                return Ok(config);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error retrieving email configuration");
                return StatusCode(500, new { message = "Error retrieving email configuration", error = ex.Message });
            }
        }

        /// <summary>
        /// Test verification email sending
        /// </summary>
        [HttpPost("test/verification")]
        public async Task<IActionResult> TestVerificationEmail([FromBody] TestVerificationEmailRequest request)
        {
            try
            {
                _logger.LogInformation("Testing verification email to: {Email}", request.Email);

                var result = await _emailService.SendVerificationCodeAsync(
                    request.Email, 
                    request.VerificationCode ?? "123456", 
                    request.Name ?? "Test User"
                );

                if (result)
                {
                    _logger.LogInformation("Verification email sent successfully to: {Email}", request.Email);
                    return Ok(new { 
                        success = true, 
                        message = $"Verification email sent successfully to {request.Email}",
                        verificationCode = request.VerificationCode ?? "123456"
                    });
                }
                else
                {
                    _logger.LogWarning("Failed to send verification email to: {Email}", request.Email);
                    return StatusCode(500, new { 
                        success = false, 
                        message = "Failed to send verification email" 
                    });
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error testing verification email for: {Email}", request.Email);
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error sending verification email", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Test welcome email sending
        /// </summary>
        [HttpPost("test/welcome")]
        public async Task<IActionResult> TestWelcomeEmail([FromBody] TestWelcomeEmailRequest request)
        {
            try
            {
                _logger.LogInformation("Testing welcome email to: {Email}", request.Email);

                var result = await _emailService.SendWelcomeEmailAsync(
                    request.Email, 
                    request.Name ?? "Test User"
                );

                if (result)
                {
                    _logger.LogInformation("Welcome email sent successfully to: {Email}", request.Email);
                    return Ok(new { 
                        success = true, 
                        message = $"Welcome email sent successfully to {request.Email}"
                    });
                }
                else
                {
                    _logger.LogWarning("Failed to send welcome email to: {Email}", request.Email);
                    return StatusCode(500, new { 
                        success = false, 
                        message = "Failed to send welcome email" 
                    });
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error testing welcome email for: {Email}", request.Email);
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error sending welcome email", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Test password reset email sending
        /// </summary>
        [HttpPost("test/password-reset")]
        public async Task<IActionResult> TestPasswordResetEmail([FromBody] TestPasswordResetEmailRequest request)
        {
            try
            {
                _logger.LogInformation("Testing password reset email to: {Email}", request.Email);

                var result = await _emailService.SendPasswordResetEmailAsync(
                    request.Email, 
                    request.ResetUrl ?? "http://localhost:3000/reset-password?token=test123",
                    request.Name ?? "Test User"
                );

                if (result)
                {
                    _logger.LogInformation("Password reset email sent successfully to: {Email}", request.Email);
                    return Ok(new { 
                        success = true, 
                        message = $"Password reset email sent successfully to {request.Email}",
                        resetUrl = request.ResetUrl ?? "http://localhost:3000/reset-password?token=test123"
                    });
                }
                else
                {
                    _logger.LogWarning("Failed to send password reset email to: {Email}", request.Email);
                    return StatusCode(500, new { 
                        success = false, 
                        message = "Failed to send password reset email" 
                    });
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error testing password reset email for: {Email}", request.Email);
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error sending password reset email", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Test email provider status
        /// </summary>
        [HttpGet("provider/status")]
        public IActionResult GetProviderStatus()
        {
            try
            {
                var provider = _configuration["Email:Provider"]?.ToLower() ?? "smtp";
                var status = new
                {
                    CurrentProvider = provider,
                    Available = new
                    {
                        SMTP = !string.IsNullOrEmpty(_configuration["Email:SmtpServer"]),
                        SendGrid = !string.IsNullOrEmpty(_configuration["SendGrid:ApiKey"]),
                        Zoho = !string.IsNullOrEmpty(_configuration["Zoho:ApiKey"]),
                        Mailgun = !string.IsNullOrEmpty(_configuration["Mailgun:ApiKey"])
                    },
                    Recommendations = new
                    {
                        Primary = "Gmail SMTP (configured)",
                        Backup = "SendGrid Free Tier (100 emails/day)",
                        Enterprise = "Zoho Mail API (business solution)"
                    }
                };

                return Ok(status);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error getting provider status");
                return StatusCode(500, new { message = "Error getting provider status", error = ex.Message });
            }
        }
    }

    // Request Models
    public class TestVerificationEmailRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        public string? Name { get; set; }

        public string? VerificationCode { get; set; }
    }

    public class TestWelcomeEmailRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        public string? Name { get; set; }
    }

    public class TestPasswordResetEmailRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        public string? Name { get; set; }

        public string? ResetUrl { get; set; }
    }
}
