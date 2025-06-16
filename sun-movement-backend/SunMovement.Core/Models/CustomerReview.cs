using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class CustomerReview
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        public int? ProductId { get; set; }
        
        public int? ServiceId { get; set; }
        
        public int? OrderId { get; set; }
        
        [Required]
        [Range(1, 5, ErrorMessage = "Đánh giá phải từ 1 đến 5 sao")]
        public int Rating { get; set; }
        
        [Required]
        [StringLength(1000, ErrorMessage = "Nội dung đánh giá không được vượt quá 1000 ký tự")]
        public string Content { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Tiêu đề không được vượt quá 500 ký tự")]
        public string? Title { get; set; }
        
        public bool IsApproved { get; set; } = false;
        
        public bool IsVerifiedPurchase { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public string? AdminResponse { get; set; }
        
        public DateTime? AdminResponseDate { get; set; }
        
        public string? AdminId { get; set; }
        
        // Navigation properties
        public virtual ApplicationUser? User { get; set; }
        public virtual Product? Product { get; set; }
        public virtual Service? Service { get; set; }
        public virtual Order? Order { get; set; }
        public virtual ApplicationUser? Admin { get; set; }
    }
}
