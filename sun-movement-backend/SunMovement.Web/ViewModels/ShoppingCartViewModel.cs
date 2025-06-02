using System;
using System.Collections.Generic;
using System.Linq;

namespace SunMovement.Web.ViewModels
{
    public class ShoppingCartViewModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<CartItemViewModel> Items { get; set; } = new List<CartItemViewModel>();
        public decimal TotalAmount => Items.Sum(i => i.Subtotal);
        public int TotalItems => Items.Sum(i => i.Quantity);
    }
}
