using System;
using System.Collections.Generic;

namespace SunMovement.Core.Models
{
    public enum ServiceType
    {
        Calisthenics,
        Strength,
        Yoga
    }

    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public ServiceType Type { get; set; }
        public string? Features { get; set; } // JSON string of features
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<ServiceSchedule>? Schedules { get; set; } = new List<ServiceSchedule>();
    }
}
