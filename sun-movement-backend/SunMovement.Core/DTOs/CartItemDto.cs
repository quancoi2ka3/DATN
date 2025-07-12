using System;

namespace SunMovement.Core.DTOs
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int? ProductId { get; set; }
        public int? ServiceId { get; set; }
        public string ItemName { get; set; }
        public string ItemImageUrl { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal => UnitPrice * Quantity;
        public ProductDto? Product { get; set; }
        public ServiceDto? Service { get; set; }
    }
}
