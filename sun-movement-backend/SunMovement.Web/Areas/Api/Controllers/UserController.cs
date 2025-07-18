using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Models;
using SunMovement.Web.Areas.Api.Models;
using SunMovement.Core.Interfaces;
using System.Security.Claims;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/user")]
    [ApiController]
    [Authorize] // Require authentication for all actions
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<UserController> _logger;
        private readonly IEmailVerificationService _emailVerificationService;

        public UserController(
            UserManager<ApplicationUser> userManager, 
            ILogger<UserController> logger,
            IEmailVerificationService emailVerificationService)
        {
            _userManager = userManager;
            _logger = logger;
            _emailVerificationService = emailVerificationService;
        }

        /// <summary>
        /// Get current user profile information
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new
                {
                    id = user.Id,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    phoneNumber = user.PhoneNumber,
                    address = user.Address,
                    dateOfBirth = user.DateOfBirth.ToString("yyyy-MM-dd"),
                    emailConfirmed = user.EmailConfirmed,
                    roles = roles,
                    createdAt = user.CreatedAt,
                    lastLogin = user.LastLogin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile for user {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { message = "An error occurred while retrieving profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Update current user profile information
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>() })
                        .ToArray();
                    
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Update user information
                user.FirstName = model.FirstName ?? user.FirstName;
                user.LastName = model.LastName ?? user.LastName;
                user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;
                user.Address = model.Address ?? user.Address;
                
                if (model.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = model.DateOfBirth.Value;
                }

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Profile updated successfully for user {UserId}", userId);
                    return Ok(new { message = "Thông tin cá nhân đã được cập nhật thành công" });
                }

                var errorMessages = result.Errors.Select(e => e.Description).ToArray();
                _logger.LogWarning("Failed to update profile for user {UserId}: {Errors}", userId, string.Join(", ", errorMessages));
                
                return BadRequest(new { 
                    message = "Không thể cập nhật thông tin cá nhân", 
                    errors = errorMessages 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile for user {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { message = "An error occurred while updating profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Change user password
        /// </summary>
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>() })
                        .ToArray();
                    
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Verify current password
                var isCurrentPasswordValid = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
                if (!isCurrentPasswordValid)
                {
                    return BadRequest(new { message = "Mật khẩu hiện tại không đúng" });
                }

                // Change password
                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Password changed successfully for user {UserId}", userId);
                    return Ok(new { message = "Mật khẩu đã được thay đổi thành công" });
                }

                var errorMessages = result.Errors.Select(e => e.Description).ToArray();
                _logger.LogWarning("Failed to change password for user {UserId}: {Errors}", userId, string.Join(", ", errorMessages));
                
                return BadRequest(new { 
                    message = "Không thể thay đổi mật khẩu", 
                    errors = errorMessages 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for user {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { message = "An error occurred while changing password", error = ex.Message });
            }
        }

        /// <summary>
        /// Send OTP for password change verification
        /// </summary>
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>() })
                        .ToArray();
                    
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (model.Purpose != "change-password")
                {
                    return BadRequest(new { message = "Mục đích OTP không hợp lệ" });
                }

                // Generate OTP for password change
                var otpCode = await _emailVerificationService.GenerateOtpCodeAsync(user.Email!, "change-password");

                _logger.LogInformation("OTP sent successfully to {Email} for password change", user.Email);
                
                return Ok(new { 
                    message = "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã để tiếp tục.",
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending OTP for user {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { message = "Có lỗi xảy ra khi gửi mã OTP", error = ex.Message });
            }
        }

        /// <summary>
        /// Change password with OTP verification
        /// </summary>
        [HttpPost("change-password-with-otp")]
        public async Task<IActionResult> ChangePasswordWithOtp([FromBody] ChangePasswordWithOtpModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>() })
                        .ToArray();
                    
                    return BadRequest(new { message = "Dữ liệu không hợp lệ", errors = errors });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Verify OTP
                var isOtpValid = await _emailVerificationService.VerifyOtpCodeAsync(user.Email!, model.OtpCode, "change-password");
                if (!isOtpValid)
                {
                    return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn" });
                }

                // Verify current password
                var isCurrentPasswordValid = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
                if (!isCurrentPasswordValid)
                {
                    return BadRequest(new { message = "Mật khẩu hiện tại không đúng" });
                }

                // Change password
                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                if (result.Succeeded)
                {
                    // Clean up the OTP after successful password change
                    await _emailVerificationService.CleanupExpiredVerificationsAsync();
                    
                    _logger.LogInformation("Password changed successfully with OTP for user {UserId}", userId);
                    return Ok(new { message = "Mật khẩu đã được thay đổi thành công" });
                }

                var errorMessages = result.Errors.Select(e => e.Description).ToArray();
                _logger.LogWarning("Failed to change password with OTP for user {UserId}: {Errors}", userId, string.Join(", ", errorMessages));
                
                return BadRequest(new { 
                    message = "Không thể thay đổi mật khẩu", 
                    errors = errorMessages 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password with OTP for user {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { message = "Có lỗi xảy ra khi thay đổi mật khẩu", error = ex.Message });
            }
        }
    }
}