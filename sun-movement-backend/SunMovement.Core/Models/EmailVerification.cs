using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    /// <summary>
    /// Represents a pending user registration that requires email verification
    /// </summary>
    public class PendingUserRegistration
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        public required string VerificationCode { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(15); // Extended to 15 minutes
        
        public bool IsVerified { get; set; } = false;
        
        public DateTime? VerifiedAt { get; set; }
        
        // Temporary user data to store during verification process
        [Required]
        public required string FirstName { get; set; }
        
        [Required]
        public required string LastName { get; set; }
        
        [Required]
        public required string Password { get; set; } // This should be hashed
        
        public DateTime? DateOfBirth { get; set; }
        
        public string? Address { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        // Helper properties
        public bool IsExpired => DateTime.UtcNow > ExpiresAt;
        
        public bool IsValid => !IsExpired && !IsVerified;
        
        // Computed properties for better management
        public string FullName => $"{FirstName} {LastName}";
        public int MinutesUntilExpiry => Math.Max(0, (int)(ExpiresAt - DateTime.UtcNow).TotalMinutes);
        public bool IsRecentlyCreated => (DateTime.UtcNow - CreatedAt).TotalMinutes < 2;
    }
}
