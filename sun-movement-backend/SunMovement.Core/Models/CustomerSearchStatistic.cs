using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class CustomerSearchStatistic
    {
        public int Id { get; set; }
        
        public string? UserId { get; set; } // Nullable for anonymous users
        
        [Required]
        public string SearchTerm { get; set; } = string.Empty;
        
        public string SearchCategory { get; set; } = "All"; // Products, Services, All
        
        public int ResultsCount { get; set; }
        
        public bool HasClickedResult { get; set; } = false;
        
        public string? ClickedResultId { get; set; }
        
        public string? ClickedResultType { get; set; } // Product, Service
        
        public string? IpAddress { get; set; }
        
        public string? UserAgent { get; set; }
        
        public string? SessionId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ApplicationUser? User { get; set; }
    }
}
