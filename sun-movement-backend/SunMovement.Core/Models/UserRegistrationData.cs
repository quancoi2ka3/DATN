using System;

namespace SunMovement.Core.Models
{
    /// <summary>
    /// Data Transfer Object for user registration data during email verification process
    /// </summary>
    public class UserRegistrationData
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Password { get; set; } // Store original password for proper Identity creation
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
