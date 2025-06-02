using System;

namespace SunMovement.Core.DTOs
{
    public class AddToCartDto
    {
        public int? ProductId { get; set; }
        public int? ServiceId { get; set; }
        public int Quantity { get; set; }
    }
}
