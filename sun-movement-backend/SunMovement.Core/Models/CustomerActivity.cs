using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class CustomerActivity
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public string ActivityType { get; set; } = string.Empty; // Login, Purchase, View, Search, etc.
        
        public string Description { get; set; } = string.Empty;
        
        public string? IpAddress { get; set; }
        
        public string? UserAgent { get; set; }
        
        public string? AdditionalData { get; set; } // JSON data for specific activity details
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ApplicationUser? User { get; set; }
    }
    
    public enum CustomerActivityType
    {
        Login,
        Logout,
        ProductView,
        ProductSearch,
        AddToCart,
        RemoveFromCart,
        OrderPlaced,
        OrderCanceled,
        ProfileUpdated,
        PasswordChanged,
        WishlistAdded,
        WishlistRemoved,
        ReviewSubmitted,
        ContactFormSubmitted
    }
}
