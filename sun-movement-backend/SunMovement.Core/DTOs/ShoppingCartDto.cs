using System;
using System.Collections.Generic;

namespace SunMovement.Core.DTOs
{
    public class ShoppingCartDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public decimal TotalAmount => GetTotalAmount();

        private decimal GetTotalAmount()
        {
            decimal total = 0;
            foreach (var item in Items)
            {
                total += item.Subtotal;
            }
            return total;
        }
    }
}
