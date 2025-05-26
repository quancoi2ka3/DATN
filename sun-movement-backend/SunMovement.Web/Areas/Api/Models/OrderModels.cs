using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Api.Models
{
    public class OrderCreateModel
    {
        [Required]
        public required string CustomerName { get; set; }
        
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        public required string Phone { get; set; }
        
        [Required]
        public required string ShippingAddress { get; set; }
        
        [Required]
        public decimal TotalAmount { get; set; }
        
        [Required]
        public required List<OrderItemModel> Items { get; set; }
    }

    public class OrderItemModel
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class OrderStatusUpdateModel
    {
        [Required]
        public OrderStatus Status { get; set; }
    }
}
