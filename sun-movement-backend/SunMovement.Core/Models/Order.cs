using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SunMovement.Core.Models
{    public enum OrderStatus
    {
        Pending,
        Paid,        // Added for VNPay
        Processing,
        Shipped,
        Delivered,
        Cancelled,
        Refunded
    }public class Order
    {
        public int Id { get; set; }
        public string? UserId { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string ShippingAddress { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;        public string? PaymentMethod { get; set; }
        public bool IsPaid { get; set; } = false;
        public string? PaymentTransactionId { get; set; }
        public DateTime? PaymentDate { get; set; }        // Added for VNPay
        public string? TransactionId { get; set; }        // Added for VNPay (same as PaymentTransactionId but for clarity)
        public string? TrackingNumber { get; set; }
        public string? Notes { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }// Navigation properties
        [JsonIgnore] // Prevent circular reference with User
        public virtual ApplicationUser? User { get; set; }
        public virtual ICollection<OrderItem>? Items { get; set; } = new List<OrderItem>();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Computed properties
        public string CustomerName => User != null ? $"{User.FirstName} {User.LastName}" : "Guest";
        public ICollection<OrderItem> OrderItems => Items ?? new List<OrderItem>();
    }
}
