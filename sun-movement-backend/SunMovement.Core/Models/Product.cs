using System;
using System.Collections.Generic;

namespace SunMovement.Core.Models
{
    public enum ProductCategory
    {
        Sportswear,
        Supplements
    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public ProductCategory Category { get; set; }
        public string SubCategory { get; set; } = string.Empty; // For more specific categorization
        public string? Specifications { get; set; } // JSON string of specs
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
    }
}
