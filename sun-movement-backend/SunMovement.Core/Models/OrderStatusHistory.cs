using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class OrderStatusHistory
    {
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        public virtual Order? Order { get; set; }
        
        public OrderStatus FromStatus { get; set; }
        public OrderStatus ToStatus { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        [StringLength(100)]
        public string? ChangedBy { get; set; } // User ID or Admin ID
        
        [StringLength(200)]
        public string? ChangedByName { get; set; } // Display name
        
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        
        // Additional context
        [StringLength(100)]
        public string? Reason { get; set; }
        
        public bool IsSystemGenerated { get; set; } = false;
        
        // Computed properties
        public string StatusChangeDescription => $"{GetStatusDisplayName(FromStatus)} → {GetStatusDisplayName(ToStatus)}";
        
        private static string GetStatusDisplayName(OrderStatus status) => status switch
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
    
    public class OrderPayment
    {
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        public virtual Order? Order { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
        
        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // COD, VNPay, Bank Transfer, etc.
        
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        
        [StringLength(100)]
        public string? TransactionId { get; set; }
        
        [StringLength(100)]
        public string? ReferenceNumber { get; set; }
        
        public DateTime? ProcessedAt { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        [StringLength(100)]
        public string? ProcessedBy { get; set; }
        
        // Gateway specific fields
        [StringLength(100)]
        public string? GatewayTransactionId { get; set; }
        
        [StringLength(50)]
        public string? GatewayResponseCode { get; set; }
        
        [StringLength(500)]
        public string? GatewayResponseMessage { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Computed properties
        public string StatusDisplayName => Status switch
        {
            PaymentStatus.Pending => "Chờ thanh toán",
            PaymentStatus.Paid => "Đã thanh toán",
            PaymentStatus.PartiallyPaid => "Thanh toán một phần",
            PaymentStatus.Refunded => "Đã hoàn tiền",
            PaymentStatus.PartiallyRefunded => "Hoàn tiền một phần",
            PaymentStatus.Failed => "Thất bại",
            PaymentStatus.Cancelled => "Đã hủy",
            _ => "Không xác định"
        };
    }
}
