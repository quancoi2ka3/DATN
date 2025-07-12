using System.Collections.Generic;

namespace SunMovement.Core.DTOs
{
    public class CartDto
    {
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public int TotalQuantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
