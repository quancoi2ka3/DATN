using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class ProductVariant
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty; // e.g., "Red - Large", "Blue - Medium"
        
        [StringLength(50)]
        public string? Sku { get; set; }
        
        [StringLength(50)]
        public string? Barcode { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        public decimal? DiscountPrice { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal CostPrice { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        
        public int MinimumStockLevel { get; set; } = 5;
        
        [Range(0, double.MaxValue)]
        public decimal Weight { get; set; } = 0;
        
        [StringLength(100)]
        public string? Dimensions { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int SortOrder { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Variant attributes (JSON format)
        public string? Attributes { get; set; } // {"Color": "Red", "Size": "Large", "Material": "Cotton"}
        
        // Navigation properties
        public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
        public virtual ICollection<ProductVariantImage> Images { get; set; } = new List<ProductVariantImage>();
        
        // Computed properties
        public bool IsInStock => StockQuantity > 0;
        public bool IsLowStock => StockQuantity <= MinimumStockLevel && StockQuantity > 0;
        public decimal EffectivePrice => DiscountPrice ?? Price;
    }
}
