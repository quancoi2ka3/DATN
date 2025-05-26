using System;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Core.DTOs
{
    public class ServiceDto
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
        
        [Required]
        public ServiceType Type { get; set; }
        
        public required string Features { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
    }
}
