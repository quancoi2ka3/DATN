using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class ProductImage
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? AltText { get; set; }
        
        [StringLength(500)]
        public string? Caption { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public int SortOrder { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
