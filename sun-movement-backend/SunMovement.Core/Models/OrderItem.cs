using System;
using System.Text.Json.Serialization;

namespace SunMovement.Core.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductOptions { get; set; }
        
        // Navigation properties
        [JsonIgnore] // Prevent circular reference
        public virtual Order? Order { get; set; }
        [JsonIgnore] // Prevent circular reference
        public virtual Product? Product { get; set; }
    }
}
