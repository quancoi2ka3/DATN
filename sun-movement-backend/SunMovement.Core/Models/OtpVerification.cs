using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    /// <summary>
    /// Represents OTP verification for various purposes (password change, etc.)
    /// </summary>
    public class OtpVerification
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        public required string OtpCode { get; set; }
        
        [Required]
        public required string Purpose { get; set; } // "change-password", "general", etc.
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(10); // 10 minutes for OTP
        
        public bool IsUsed { get; set; } = false;
        
        public DateTime? UsedAt { get; set; }
        
        // Helper properties
        public bool IsExpired => DateTime.UtcNow > ExpiresAt;
        
        public bool IsValid => !IsExpired && !IsUsed;
        
        // Additional data for specific purposes (JSON format)
        public string? AdditionalData { get; set; }
    }
}
