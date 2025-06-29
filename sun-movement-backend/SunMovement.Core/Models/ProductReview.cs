using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class ProductReview
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        public int? ProductVariantId { get; set; }
        public virtual ProductVariant? ProductVariant { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        public virtual ApplicationUser? User { get; set; }
        
        public int? OrderId { get; set; }
        public virtual Order? Order { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [StringLength(200)]
        public string? Title { get; set; }
        
        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;
        
        public bool IsVerifiedPurchase { get; set; } = false;
        
        public bool IsApproved { get; set; } = false;
        
        public int HelpfulCount { get; set; } = 0;
        
        public int UnhelpfulCount { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Admin response
        public string? AdminResponse { get; set; }
        public DateTime? AdminResponseDate { get; set; }
        public string? AdminId { get; set; }
        public virtual ApplicationUser? Admin { get; set; }
        
        // Navigation properties
        public virtual ICollection<ProductReviewHelpful> HelpfulVotes { get; set; } = new List<ProductReviewHelpful>();
        public virtual ICollection<ProductReviewImage> Images { get; set; } = new List<ProductReviewImage>();
    }
    
    public class ProductReviewHelpful
    {
        public int Id { get; set; }
        
        public int ProductReviewId { get; set; }
        public virtual ProductReview? ProductReview { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        public virtual ApplicationUser? User { get; set; }
        
        public bool IsHelpful { get; set; } = true; // true = helpful, false = not helpful
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    public class ProductReviewImage
    {
        public int Id { get; set; }
        
        public int ProductReviewId { get; set; }
        public virtual ProductReview? ProductReview { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? AltText { get; set; }
        
        public int SortOrder { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
