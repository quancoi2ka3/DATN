using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SunMovement.Core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<Order>? Orders { get; set; } = new List<Order>();
        
        // Computed properties
        public int OrderCount => Orders?.Count ?? 0;
        public decimal TotalSpent => Orders?.Sum(o => o.TotalAmount) ?? 0;
        public DateTime? LastOrderDate => Orders?.OrderByDescending(o => o.OrderDate).FirstOrDefault()?.OrderDate;
    }
}
