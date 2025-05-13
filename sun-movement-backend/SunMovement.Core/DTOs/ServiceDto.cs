using System;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Core.DTOs
{
    public class ServiceDto
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
        
        [Required]
        public ServiceType Type { get; set; }
        
        public string Features { get; set; }
        
        public bool IsActive { get; set; }
    }
}
