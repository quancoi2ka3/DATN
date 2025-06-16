using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SunMovement.Core.Models;
using SunMovement.Core.Services;
using SunMovement.Core.Interfaces;
using SunMovement.Web.Areas.Api.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase    {        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailVerificationService _emailVerificationService;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            IEmailVerificationService emailVerificationService,
            IEmailService emailService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailVerificationService = emailVerificationService;
            _emailService = emailService;
            _logger = logger;
        }        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            try
            {
                // Enhanced logging for debugging
                _logger.LogInformation("Registration attempt for email: {Email}", model.Email);
                  if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>() })
                        .ToArray();
                    
                    _logger.LogWarning("Registration validation failed for {Email}: {Errors}", model.Email, string.Join(", ", errors.Select(e => $"{e.Field}: {string.Join(", ", e.Errors)}")));
                    return BadRequest(new { message = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.", errors = errors });
                }                // Check if user already exists
                _logger.LogDebug("Checking if user exists: {Email}", model.Email);
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration attempt for existing user: {Email}", model.Email);
                    return BadRequest(new { message = "Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập." });
                }

                // Store original password for proper Identity creation during verification
                _logger.LogDebug("Creating registration data for {Email}", model.Email);
                var userData = new UserRegistrationData
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Password = model.Password, // Store original password for Identity
                    DateOfBirth = model.ParsedDateOfBirth,
                    Address = model.Address,
                    PhoneNumber = model.PhoneNumber
                };// Generate verification code and send email
                _logger.LogDebug("Generating verification code for {Email}", model.Email);
                var verificationCode = await _emailVerificationService.GenerateVerificationCodeAsync(model.Email, userData);
                
                _logger.LogInformation("Registration initiated successfully for {Email}, verification code generated", model.Email);
                  // Note: The email sending status is logged in EmailVerificationService
                // We don't fail the registration if email fails, as user can still verify manually
                return Ok(new { 
                    message = "Đăng ký thành công! Vui lòng kiểm tra email để nhận mã xác thực. Nếu không thấy email, hãy kiểm tra hộp thư spam hoặc yêu cầu gửi lại mã.",
                    requiresVerification = true,
                    email = model.Email // Include email for frontend to show in verification modal
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for {Email}", model?.Email ?? "unknown");
                return StatusCode(500, new { 
                    message = "Đã xảy ra lỗi trong quá trình đăng ký",
                    error = ex.Message,
                    details = ex.InnerException?.Message 
                });
            }
        }        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailModel model)
        {
            try
            {
                _logger.LogInformation("🔍 Email verification attempt for: {Email} with code: {Code}", model?.Email ?? "null", model?.VerificationCode ?? "null");
                
                if (model == null)
                {
                    _logger.LogWarning("❌ Model is null for email verification");
                    return BadRequest(new { message = "Invalid request data" });
                }
                  if (!ModelState.IsValid)
                {
                    _logger.LogWarning("❌ Invalid model state for email verification");
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = ModelState });
                }

                // Verify the code
                _logger.LogInformation("🔐 Verifying code for {Email}...", model.Email);
                var isValid = await _emailVerificationService.VerifyCodeAsync(model.Email, model.VerificationCode);
                
                if (!isValid)
                {
                    _logger.LogWarning("❌ Invalid or expired verification code for {Email}", model.Email);
                    return BadRequest(new { message = "Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại hoặc yêu cầu gửi lại mã." });
                }

                _logger.LogInformation("✅ Verification code valid for {Email}", model.Email);

                // Get the verification data
                var verificationData = await _emailVerificationService.GetVerificationDataAsync(model.Email);
                  if (verificationData == null)
                {
                    _logger.LogError("❌ Verification data not found for {Email}", model.Email);
                    return BadRequest(new { message = "Không tìm thấy dữ liệu xác thực. Vui lòng đăng ký lại." });
                }                _logger.LogInformation("📋 Creating user account for {Email}...", model.Email);
                
                // Check if user already exists (in case of multiple verification attempts)
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("⚠️ User already exists for {Email}, cleaning up verification data", model.Email);
                    await _emailVerificationService.CleanupExpiredVerificationsAsync();
                    return Ok(new { message = "Email đã được xác thực! Bạn có thể đăng nhập ngay bây giờ." });
                }
                  // Validate verification data
                if (string.IsNullOrEmpty(verificationData.Password))
                {
                    _logger.LogError("❌ Password is null or empty in verification data for {Email}", model.Email);
                    return BadRequest(new { message = "Registration data is corrupted. Please register again." });
                }

                _logger.LogInformation("🔍 Verification data validated - Password length: {PasswordLength}, FirstName: {FirstName}, LastName: {LastName}", 
                    verificationData.Password.Length, verificationData.FirstName, verificationData.LastName);

                // Create the actual user account
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    EmailConfirmed = true,
                    FirstName = verificationData.FirstName ?? string.Empty,
                    LastName = verificationData.LastName ?? string.Empty,
                    DateOfBirth = verificationData.DateOfBirth ?? DateTime.UtcNow,
                    Address = verificationData.Address ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    PhoneNumber = verificationData.PhoneNumber
                };

                // Create user with the original password using UserManager for proper password hashing
                _logger.LogInformation("🔐 Creating user with email: {Email}, Password length: {PasswordLength}", 
                    model.Email, verificationData.Password.Length);
                
                var result = await _userManager.CreateAsync(user, verificationData.Password);
                
                _logger.LogInformation("👤 User creation result: Success={Success}, ErrorCount={ErrorCount}", 
                    result.Succeeded, result.Errors?.Count() ?? 0);
                
                if (!result.Succeeded && result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        _logger.LogError("❌ User creation error: Code={Code}, Description={Description}", 
                            error.Code, error.Description);
                    }
                }
                  if (result.Succeeded)
                {
                    _logger.LogInformation("✅ User created successfully, adding to Customer role...");
                    
                    // Mark verification as completed
                    await _emailVerificationService.MarkVerificationCompletedAsync(model.Email);
                    
                    // Add to Customer role
                    var roleResult = await _userManager.AddToRoleAsync(user, "Customer");
                    if (!roleResult.Succeeded)
                    {
                        _logger.LogWarning("⚠️ Failed to add user to Customer role, but user was created");
                        if (roleResult.Errors != null)
                        {
                            foreach (var error in roleResult.Errors)
                            {
                                _logger.LogWarning("Role error: {Code} - {Description}", error.Code, error.Description);
                            }
                        }
                    }
                    
                    // Send welcome email
                    try
                    {
                        await _emailService.SendWelcomeEmailAsync(model.Email, verificationData.FirstName ?? "Customer");
                        _logger.LogInformation("📧 Welcome email sent to {Email}", model.Email);
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogWarning(emailEx, "⚠️ Failed to send welcome email, but user was created successfully");
                    }
                    
                    // Clean up verification data
                    await _emailVerificationService.CleanupExpiredVerificationsAsync();
                      _logger.LogInformation("🎉 Email verification completed successfully for {Email}", model.Email);
                    return Ok(new { message = "Xác thực email thành công! Chào mừng bạn đến với Sun Movement!" });
                }

                var errorMessages = result.Errors?.Select(e => $"{e.Code}: {e.Description}").ToArray() ?? new string[0];
                _logger.LogError("❌ Failed to create user account for {Email}: {Errors}", 
                    model.Email, string.Join(", ", errorMessages));
                
                return BadRequest(new { 
                    message = "Không thể tạo tài khoản người dùng. Vui lòng kiểm tra lại thông tin.", 
                    errors = result.Errors?.Select(e => new { e.Code, e.Description }).ToArray() ?? new object[0],
                    details = errorMessages
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xác thực", details = ex.Message });
            }
        }        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification(ResendVerificationModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid email address" });
                }

                var success = await _emailVerificationService.ResendVerificationCodeAsync(model.Email);
                
                if (success)
                {
                    return Ok(new { message = "Verification code resent successfully!" });
                }
                
                return BadRequest(new { message = "Failed to resend verification code. Please try registering again." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while resending verification code", details = ex.Message });
            }
        }        [HttpPost("check-user-status")]
        public async Task<IActionResult> CheckUserStatus([FromBody] TestEmailModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid email address" });
                }

                _logger.LogInformation("🔍 Checking user status for: {Email}", model.Email);

                // Check if user exists in database
                var user = await _userManager.FindByEmailAsync(model.Email);
                
                if (user == null)
                {
                    _logger.LogInformation("❌ User not found in database: {Email}", model.Email);
                    
                    // Check if there's pending verification
                    var verificationData = await _emailVerificationService.GetVerificationDataAsync(model.Email);
                    
                    return Ok(new 
                    {
                        userExists = false,
                        emailConfirmed = false,
                        hasVerificationPending = verificationData != null,
                        message = verificationData != null 
                            ? "User registered but email verification is pending. Please check your email for verification code."
                            : "User not found. Please register first."
                    });
                }

                _logger.LogInformation("✅ User found: {Email}, EmailConfirmed: {EmailConfirmed}, IsActive: {IsActive}", 
                    user.Email, user.EmailConfirmed, user.IsActive);

                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new 
                {
                    userExists = true,
                    emailConfirmed = user.EmailConfirmed,
                    isActive = user.IsActive,
                    roles = roles,
                    createdAt = user.CreatedAt,
                    lastLogin = user.LastLogin,
                    hasVerificationPending = false,
                    message = user.EmailConfirmed 
                        ? "User account is active and ready for login"
                        : "User exists but email is not confirmed"
                });
            }
            catch (Exception ex)
            {
                var email = model?.Email ?? "unknown";
                _logger.LogError(ex, "Error checking user status for email: {Email}", email);
                return StatusCode(500, new { message = "An error occurred while checking user status" });
            }
        }[HttpGet("password-requirements")]
        public IActionResult GetPasswordRequirements()
        {
            return Ok(new
            {
                minLength = 8,
                requireDigit = true,
                requireLowercase = true,
                requireUppercase = true,
                requireNonAlphanumeric = true,
                description = "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.",
                descriptionEn = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            });
        }[HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            try
            {
                _logger.LogInformation("🔐 Login attempt for email: {Email}", model?.Email ?? "null");
                
                if (model == null)
                {
                    _logger.LogWarning("❌ Login model is null");
                    return BadRequest(new { message = "Invalid request data" });
                }
                
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>() })
                        .ToArray();
                    
                    _logger.LogWarning("❌ Login validation failed for {Email}: {Errors}", model.Email, string.Join(", ", errors.Select(e => $"{e.Field}: {string.Join(", ", e.Errors)}")));
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    _logger.LogWarning("❌ Login attempt with missing email or password");
                    return BadRequest(new { message = "Email and password are required" });
                }

                _logger.LogDebug("🔍 Looking up user: {Email}", model.Email);
                var user = await _userManager.FindByEmailAsync(model.Email);                if (user == null)
                {
                    _logger.LogWarning("❌ User not found: {Email}", model.Email);
                    return Unauthorized(new { message = "Email hoặc mật khẩu không đúng. Vui lòng thử lại." });
                }

                _logger.LogDebug("✅ User found: {Email}, EmailConfirmed: {EmailConfirmed}, IsActive: {IsActive}", 
                    user.Email, user.EmailConfirmed, user.IsActive);

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                
                _logger.LogDebug("🔐 Password check result: Succeeded={Succeeded}, IsLockedOut={IsLockedOut}, RequiresTwoFactor={RequiresTwoFactor}", 
                    result.Succeeded, result.IsLockedOut, result.RequiresTwoFactor);

                if (result.Succeeded)
                {
                    _logger.LogInformation("✅ Login successful for {Email}", model.Email);
                    
                    user.LastLogin = DateTime.UtcNow;
                    await _userManager.UpdateAsync(user);

                    var roles = await _userManager.GetRolesAsync(user);
                    var token = GenerateJwtToken(user, roles);

                    return Ok(new 
                    { 
                        token,
                        expiration = DateTime.UtcNow.AddMinutes(GetJwtDurationInMinutes()),
                        user = new {
                            id = user.Id,
                            email = user.Email,
                            firstName = user.FirstName,
                            lastName = user.LastName,
                            roles
                        }
                    });
                }                _logger.LogWarning("❌ Login failed for {Email} - Invalid credentials (password check failed)", model.Email);
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng. Vui lòng thử lại." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error during login for {Email}", model?.Email ?? "unknown");
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        private double GetJwtDurationInMinutes()
        {
            string? durationStr = _configuration["Jwt:DurationInMinutes"];
            if (!string.IsNullOrEmpty(durationStr) && double.TryParse(durationStr, out double parsedDuration))
            {
                return parsedDuration;
            }
            return 60; // Default to 60 minutes
        }        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim("firstName", user.FirstName ?? string.Empty),
                new Claim("lastName", user.LastName ?? string.Empty)
            };

            // Add role claims
            foreach (var role in roles ?? new List<string>())
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Get JWT key with fallback
            string jwtKey = _configuration["Jwt:Key"] ?? "ThisIsMySecretKeyForSunMovementApp2025";
            
            // Get JWT issuer and audience with fallbacks
            string issuer = _configuration["Jwt:Issuer"] ?? "SunMovement.Web";
            string audience = _configuration["Jwt:Audience"] ?? "SunMovement.Client";
            
            // Create token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(GetJwtDurationInMinutes());
            
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
