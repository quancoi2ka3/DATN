using System;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Core.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        public string ImageUrl { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        public decimal? DiscountPrice { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        
        [Required]
        public ProductCategory Category { get; set; }
        
        public string SubCategory { get; set; }
        
        public string Specifications { get; set; }
        
        public bool IsFeatured { get; set; }
        
        public bool IsActive { get; set; }
    }
}
