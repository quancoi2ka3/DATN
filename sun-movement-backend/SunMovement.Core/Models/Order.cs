using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public enum OrderStatus
    {
        Pending = 0,           // Chờ xử lý
        AwaitingPayment = 1,   // Chờ thanh toán
        Paid = 2,              // Đã thanh toán
        Processing = 3,        // Đang xử lý
        AwaitingFulfillment = 4, // Chờ đóng gói
        Shipped = 5,           // Đã gửi hàng
        PartiallyShipped = 6,  // Gửi hàng một phần
        Delivered = 7,         // Đã giao hàng
        Completed = 8,         // Hoàn thành
        Cancelled = 9,         // Đã hủy
        Refunded = 10,         // Đã hoàn tiền
        ReturnRequested = 11,  // Yêu cầu trả hàng
        ReturnProcessed = 12,  // Đã xử lý trả hàng
        Failed = 13,           // Thất bại
        OnHold = 14            // Tạm giữ
    }
    
    public enum PaymentStatus
    {
        Pending = 0,           // Chờ thanh toán
        Paid = 1,              // Đã thanh toán
        PartiallyPaid = 2,     // Thanh toán một phần
        Refunded = 3,          // Đã hoàn tiền
        PartiallyRefunded = 4, // Hoàn tiền một phần
        Failed = 5,            // Thanh toán thất bại
        Cancelled = 6          // Đã hủy thanh toán
    }

    public class Order
    {
        public int Id { get; set; }
        
        public string? UserId { get; set; } = string.Empty;
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal TotalAmount { get; set; }
        
        public decimal SubtotalAmount { get; set; } = 0;
        public decimal TaxAmount { get; set; } = 0;
        public decimal ShippingAmount { get; set; } = 0;
        public decimal DiscountAmount { get; set; } = 0;
        
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        
        [Required]
        [StringLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? BillingAddress { get; set; }
        
        [Required]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        // Coupon information
        [StringLength(50)]
        public string? CouponCode { get; set; }
        
        // Payment information
        [StringLength(50)]
        public string? PaymentMethod { get; set; }
        
        public bool IsPaid { get; set; } = false;
        
        [StringLength(100)]
        public string? PaymentTransactionId { get; set; }
        
        public DateTime? PaymentDate { get; set; }
        
        [StringLength(100)]
        public string? TransactionId { get; set; }
        
        // Shipping information
        [StringLength(100)]
        public string? TrackingNumber { get; set; }
        
        [StringLength(100)]
        public string? ShippingMethod { get; set; }
        
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        
        // Additional information
        [StringLength(1000)]
        public string? Notes { get; set; }
        
        [StringLength(1000)]
        public string? InternalNotes { get; set; }
        
        // Customer information for guest orders
        [StringLength(200)]
        public string? CustomerName { get; set; }
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Priority and urgency
        public bool IsUrgent { get; set; } = false;
        public int Priority { get; set; } = 0; // 0 = normal, 1 = high, 2 = critical
        
        // Navigation properties
        [JsonIgnore] // Prevent circular reference with User
        public virtual ApplicationUser? User { get; set; }
        
        public virtual ICollection<OrderItem>? Items { get; set; } = new List<OrderItem>();
        public virtual ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
        public virtual ICollection<OrderPayment> Payments { get; set; } = new List<OrderPayment>();
        
        // Computed properties
        public string DisplayCustomerName => !string.IsNullOrEmpty(CustomerName) 
            ? CustomerName 
            : User != null ? $"{User.FirstName} {User.LastName}" : "Guest";
            
        public ICollection<OrderItem> OrderItems => Items ?? new List<OrderItem>();
        
        public bool CanBeCancelled => Status == OrderStatus.Pending || 
                                     Status == OrderStatus.AwaitingPayment ||
                                     Status == OrderStatus.Processing;
                                     
        public bool CanBeRefunded => Status == OrderStatus.Delivered || 
                                    Status == OrderStatus.Completed;
                                    
        public string StatusDisplayName => Status switch
        {
            OrderStatus.Pending => "Chờ xử lý",
            OrderStatus.AwaitingPayment => "Chờ thanh toán",
            OrderStatus.Paid => "Đã thanh toán",
            OrderStatus.Processing => "Đang xử lý",
            OrderStatus.AwaitingFulfillment => "Chờ đóng gói",
            OrderStatus.Shipped => "Đã gửi hàng",
            OrderStatus.PartiallyShipped => "Gửi hàng một phần",
            OrderStatus.Delivered => "Đã giao hàng",
            OrderStatus.Completed => "Hoàn thành",
            OrderStatus.Cancelled => "Đã hủy",
            OrderStatus.Refunded => "Đã hoàn tiền",
            OrderStatus.ReturnRequested => "Yêu cầu trả hàng",
            OrderStatus.ReturnProcessed => "Đã xử lý trả hàng",
            OrderStatus.Failed => "Thất bại",
            OrderStatus.OnHold => "Tạm giữ",
            _ => "Không xác định"
        };
    }
}
