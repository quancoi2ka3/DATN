using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class ProductVariantImage
    {
        public int Id { get; set; }
        
        public int ProductVariantId { get; set; }
        public virtual ProductVariant? ProductVariant { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? AltText { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public int SortOrder { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
