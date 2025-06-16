using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class ShoppingCart
    {
        public int Id { get; set; }
        
        [Required]
        public required string UserId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<CartItem> Items { get; set; } = new List<CartItem>();
        
        // Calculated properties
        public decimal TotalAmount => Items.Sum(item => item.Subtotal);
        
        public int TotalItems => Items.Sum(item => item.Quantity);
    }
}
