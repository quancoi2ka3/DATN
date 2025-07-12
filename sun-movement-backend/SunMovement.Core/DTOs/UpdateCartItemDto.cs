using System;

namespace SunMovement.Core.DTOs
{
    public class UpdateCartItemDto
    {
        public int ItemId { get; set; }
        public int CartItemId { get; set; }
        public int Quantity { get; set; }
    }
}
