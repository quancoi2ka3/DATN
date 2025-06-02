using System;
using System.Collections.Generic;

namespace SunMovement.Web.ViewModels
{
    public class CartItemViewModel
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
    }
}
