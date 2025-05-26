using System;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Core.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        
        [Required]
        public required string Name { get; set; }
        
        [Required]
        public required string Description { get; set; }
        
        [Required]
        public required string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        public decimal? DiscountPrice { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        
        [Required]
        public ProductCategory Category { get; set; }
        
        public required string SubCategory { get; set; } = string.Empty;
        
        public required string Specifications { get; set; } = string.Empty;
        
        public bool IsFeatured { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
}
