using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public enum ProductCategory
    {
        Sportswear = 0,
        Supplements = 1,
        Equipment = 2,
        Accessories = 3,
        Nutrition = 4
    }

    public enum ProductStatus
    {
        Active = 0,
        Inactive = 1,
        OutOfStock = 2,
        Discontinued = 3
    }

    public partial class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        public string? ImageUrl { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        public decimal? DiscountPrice { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal CostPrice { get; set; } = 0; // Giá nhập - thêm để tính lợi nhuận
        
        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        
        // Enhanced inventory management
        public DateTime FirstStockDate { get; set; } = DateTime.UtcNow; // Ngày nhập hàng đầu tiên
        public DateTime LastStockUpdateDate { get; set; } = DateTime.UtcNow; // Ngày nhập/xuất gần nhất
        public int MinimumStockLevel { get; set; } = 5; // Ngưỡng cảnh báo hết hàng
        public int OptimalStockLevel { get; set; } = 50; // Số lượng tối ưu cần duy trì
        
        // Enhanced product information
        [StringLength(50)]
        public string? Sku { get; set; } // Stock Keeping Unit
        
        [StringLength(50)]
        public string? Barcode { get; set; }
        
        public ProductCategory Category { get; set; }
        
        [StringLength(100)]
        public string SubCategory { get; set; } = string.Empty; // For more specific categorization
        
        public string? Specifications { get; set; } // JSON string of specs
        
        // Product attributes
        public bool IsFeatured { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public ProductStatus Status { get; set; } = ProductStatus.Active;
        public int SortOrder { get; set; } = 0;
        
        // Physical attributes
        [Range(0, double.MaxValue)]
        public decimal Weight { get; set; } = 0; // In grams
        
        [StringLength(100)]
        public string? Dimensions { get; set; } // L x W x H in cm
        
        // SEO and marketing
        [StringLength(200)]
        public string? MetaTitle { get; set; }
        
        [StringLength(500)]
        public string? MetaDescription { get; set; }
        
        [StringLength(200)]
        public string? MetaKeywords { get; set; }
        
        [StringLength(200)]
        public string? Slug { get; set; }
        
        // Inventory tracking
        public bool TrackInventory { get; set; } = true;
        public bool AllowBackorder { get; set; } = false;
        
        // Ratings and reviews
        public decimal AverageRating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
        public virtual ICollection<ProductSupplier> ProductSuppliers { get; set; } = new List<ProductSupplier>();
        public virtual ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
        public virtual ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();
        public virtual ICollection<ProductSize> Sizes { get; set; } // Only for sportwear
        
        // Computed properties
        public bool IsInStock => StockQuantity > 0;
        public bool IsLowStock => StockQuantity <= MinimumStockLevel && StockQuantity > 0;
        public bool IsOutOfStock => StockQuantity <= 0;
        public decimal DiscountPercentage => DiscountPrice.HasValue && Price > 0 
            ? Math.Round((Price - DiscountPrice.Value) / Price * 100, 2) : 0;
        public decimal EffectivePrice => DiscountPrice ?? Price;
    }
}
