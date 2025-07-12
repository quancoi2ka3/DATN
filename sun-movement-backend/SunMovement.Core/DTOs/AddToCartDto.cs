using System;

namespace SunMovement.Core.DTOs
{
    public class AddToCartDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public decimal UnitPrice { get; set; }
        public int? ProductId { get; set; }
        public int? ServiceId { get; set; }
        public int Quantity { get; set; }
    }
}
