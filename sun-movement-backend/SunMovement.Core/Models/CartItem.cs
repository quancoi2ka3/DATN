using System;

namespace SunMovement.Core.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int ShoppingCartId { get; set; }
        public int? ProductId { get; set; }
        public int? ServiceId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string ItemImageUrl { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Calculated property
        public decimal Subtotal => UnitPrice * Quantity;
        
        // Navigation properties
        public virtual ShoppingCart? ShoppingCart { get; set; }
        public virtual Product? Product { get; set; }
        public virtual Service? Service { get; set; }
    }
}
