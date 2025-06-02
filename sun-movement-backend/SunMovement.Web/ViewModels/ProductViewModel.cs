using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [Range(0.01, 10000)]
        public decimal Price { get; set; }

        public string ImageUrl { get; set; }

        public IFormFile ImageFile { get; set; }

        [Required]
        public string Category { get; set; }

        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Stock information
        public int StockQuantity { get; set; }

        // Brand and other metadata
        public string Brand { get; set; }
        
        public string SKU { get; set; }
        
        public decimal DiscountPrice { get; set; }
        
        public bool HasDiscount => DiscountPrice > 0 && DiscountPrice < Price;
    }
}
