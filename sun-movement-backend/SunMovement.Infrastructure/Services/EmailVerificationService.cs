using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Infrastructure.Services
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailVerificationService> _logger;

        public EmailVerificationService(
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<EmailVerificationService> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }        public async Task<string> GenerateVerificationCodeAsync(string email, UserRegistrationData userData)
        {
            try
            {                // Remove any existing verifications for this email
                var existingVerifications = await _context.PendingUserRegistrations
                    .Where(ev => ev.Email == email)
                    .ToListAsync();

                if (existingVerifications.Any())
                {
                    _context.PendingUserRegistrations.RemoveRange(existingVerifications);
                }

                // Generate a 6-digit verification code
                var verificationCode = GenerateRandomCode();

                // Create new verification record
                var verification = new PendingUserRegistration
                {
                    Email = email,
                    VerificationCode = verificationCode,
                    FirstName = userData.FirstName,
                    LastName = userData.LastName,
                    Password = userData.Password, // This should already be hashed
                    DateOfBirth = userData.DateOfBirth,
                    Address = userData.Address,
                    PhoneNumber = userData.PhoneNumber,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15) // Extended to 15 minutes for better UX
                };                _context.PendingUserRegistrations.Add(verification);
                await _context.SaveChangesAsync();// Send verification email
                _logger.LogInformation("Attempting to send verification email to {Email}", email);
                var emailSent = await _emailService.SendVerificationCodeAsync(email, verificationCode, userData.FirstName);

                if (!emailSent)
                {
                    _logger.LogError("Failed to send verification email to {Email}. SMTP configuration may be incorrect or email service may be down.", email);
                    // Still return the verification code so user can manually enter it if they received it through other means
                    // or can use the resend functionality
                }
                else
                {
                    _logger.LogInformation("Verification email sent successfully to {Email}", email);
                }

                return verificationCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating verification code for {Email}", email);
                throw;
            }
        }        public async Task<bool> VerifyCodeAsync(string email, string code)
        {
            try
            {
                var verification = await _context.PendingUserRegistrations
                    .FirstOrDefaultAsync(ev => ev.Email == email && ev.VerificationCode == code);if (verification == null)
                {
                    _logger.LogWarning("Invalid verification code for {Email}", email);
                    return false;
                }

                // Check expiration using direct date comparison instead of computed property
                if (verification.ExpiresAt <= DateTime.UtcNow)
                {
                    _logger.LogWarning("Expired verification code for {Email}", email);
                    return false;
                }

                if (verification.IsVerified)
                {
                    _logger.LogWarning("Verification code already used for {Email}", email);
                    return false;
                }

                // Don't mark as verified yet - this will be done after user creation succeeds
                // Just validate that the code is correct and not expired
                _logger.LogInformation("Email verification code validated successfully for {Email}", email);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying code for {Email}", email);
                return false;
            }
        }        public async Task<PendingUserRegistration?> GetVerificationDataAsync(string email)
        {
            try
            {
                // Get the verification record that hasn't been used yet and hasn't expired
                // Use raw date comparison instead of computed property to avoid EF translation issues
                var currentTime = DateTime.UtcNow;
                return await _context.PendingUserRegistrations
                    .FirstOrDefaultAsync(ev => ev.Email == email && !ev.IsVerified && ev.ExpiresAt > currentTime);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting verification data for {Email}", email);
                return null;
            }
        }

        public async Task<bool> ResendVerificationCodeAsync(string email)
        {            try
            {
                var verification = await _context.PendingUserRegistrations
                    .FirstOrDefaultAsync(ev => ev.Email == email && !ev.IsVerified);

                if (verification == null)
                {
                    _logger.LogWarning("No pending verification found for {Email}", email);
                    return false;
                }

                // Generate new code and extend expiry
                verification.VerificationCode = GenerateRandomCode();
                verification.CreatedAt = DateTime.UtcNow;
                verification.ExpiresAt = DateTime.UtcNow.AddMinutes(15);

                await _context.SaveChangesAsync();

                // Send new verification email
                var emailSent = await _emailService.SendVerificationCodeAsync(email, verification.VerificationCode, verification.FirstName);

                if (!emailSent)
                {
                    _logger.LogWarning("Failed to resend verification email to {Email}", email);
                    return false;
                }

                _logger.LogInformation("Verification code resent to {Email}", email);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resending verification code for {Email}", email);
                return false;
            }
        }        public async Task CleanupExpiredVerificationsAsync()
        {            try
            {
                var expiredVerifications = await _context.PendingUserRegistrations
                    .Where(ev => ev.ExpiresAt < DateTime.UtcNow)
                    .ToListAsync();

                if (expiredVerifications.Any())
                {
                    _context.PendingUserRegistrations.RemoveRange(expiredVerifications);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Cleaned up {Count} expired verification records", expiredVerifications.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired verifications");
            }
        }        public async Task<bool> MarkVerificationCompletedAsync(string email)
        {            try
            {
                var currentTime = DateTime.UtcNow;
                var verification = await _context.PendingUserRegistrations
                    .FirstOrDefaultAsync(ev => ev.Email == email && !ev.IsVerified && ev.ExpiresAt > currentTime);

                if (verification != null)
                {
                    verification.IsVerified = true;
                    verification.VerifiedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Marked verification as completed for {Email}", email);
                    return true;
                }

                _logger.LogWarning("No pending verification found to mark as completed for {Email}", email);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking verification as completed for {Email}", email);
                return false;
            }
        }

        public async Task<string> GenerateOtpCodeAsync(string email, string purpose = "general")
        {
            try
            {
                // Remove any existing OTP for this email and purpose
                var existingOtps = await _context.OtpVerifications
                    .Where(otp => otp.Email == email && otp.Purpose == purpose)
                    .ToListAsync();

                if (existingOtps.Any())
                {
                    _context.OtpVerifications.RemoveRange(existingOtps);
                }

                // Generate a 6-digit OTP code
                var otpCode = GenerateRandomCode();

                // Create new OTP record
                var otpVerification = new OtpVerification
                {
                    Email = email,
                    OtpCode = otpCode,
                    Purpose = purpose,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(10) // 10 minutes expiration
                };

                _context.OtpVerifications.Add(otpVerification);
                await _context.SaveChangesAsync();

                // Send OTP email
                try
                {
                    await _emailService.SendOtpEmailAsync(email, otpCode, purpose);
                    _logger.LogInformation("OTP sent successfully to {Email} for purpose {Purpose}", email, purpose);
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Failed to send OTP email to {Email} for purpose {Purpose}", email, purpose);
                    // Continue without failing the OTP generation
                }

                return otpCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating OTP for {Email} with purpose {Purpose}", email, purpose);
                throw;
            }
        }

        public async Task<bool> VerifyOtpCodeAsync(string email, string code, string purpose = "general")
        {
            try
            {
                var currentTime = DateTime.UtcNow;
                var otpVerification = await _context.OtpVerifications
                    .FirstOrDefaultAsync(otp => otp.Email == email && 
                                               otp.OtpCode == code && 
                                               otp.Purpose == purpose &&
                                               !otp.IsUsed && 
                                               otp.ExpiresAt > currentTime);

                if (otpVerification != null)
                {
                    // Mark OTP as used
                    otpVerification.IsUsed = true;
                    otpVerification.UsedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("OTP verified successfully for {Email} with purpose {Purpose}", email, purpose);
                    return true;
                }

                _logger.LogWarning("Invalid or expired OTP code for {Email} with purpose {Purpose}", email, purpose);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying OTP for {Email} with purpose {Purpose}", email, purpose);
                return false;
            }
        }

        private string GenerateRandomCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}
