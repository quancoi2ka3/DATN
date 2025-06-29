using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class Tag
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Slug { get; set; }
        
        [StringLength(200)]
        public string? Description { get; set; }
        
        public string? Color { get; set; } = "#007bff"; // Bootstrap primary color as default
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();
    }
    
    public class ProductTag
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        public int TagId { get; set; }
        public virtual Tag? Tag { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
