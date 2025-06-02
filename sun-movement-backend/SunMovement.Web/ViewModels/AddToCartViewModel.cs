using System;

namespace SunMovement.Web.ViewModels
{
    public class AddToCartViewModel
    {
        public int? ProductId { get; set; }
        public int? ServiceId { get; set; }
        public int Quantity { get; set; } = 1;
        public string ReturnUrl { get; set; }
    }
}
