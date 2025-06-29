using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public enum InventoryTransactionType
    {
        Purchase = 0,     // Nhập hàng từ nhà cung cấp
        Sale = 1,         // Bán hàng
        Return = 2,       // Khách trả hàng
        Adjustment = 3,   // Điều chỉnh kho (hết hạn, hỏng...)
        Transfer = 4,     // Chuyển kho (nếu có nhiều kho)
        Damaged = 5,      // Hàng hỏng
        Expired = 6,      // Hàng hết hạn
        Promotion = 7     // Khuyến mãi, tặng kèm
    }

    public class InventoryTransaction
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        public int? ProductVariantId { get; set; }
        public virtual ProductVariant? ProductVariant { get; set; }
        
        public InventoryTransactionType TransactionType { get; set; }
        
        public int Quantity { get; set; } // Số lượng (+) hoặc (-) tùy loại giao dịch
        
        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; } = 0; // Giá giao dịch
        
        [Range(0, double.MaxValue)]
        public decimal TotalCost { get; set; } = 0; // Tổng chi phí
        
        public int? SupplierId { get; set; }
        public virtual Supplier? Supplier { get; set; }
        
        [StringLength(100)]
        public string? ReferenceNumber { get; set; } = string.Empty; // Số đơn hàng hoặc phiếu nhập
        
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        
        [StringLength(500)]
        public string? Notes { get; set; } = string.Empty;
        
        public int? OrderId { get; set; }
        public virtual Order? Order { get; set; }
        
        [StringLength(100)]
        public string? CreatedBy { get; set; } = string.Empty; // Username of admin
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Batch/Lot tracking
        [StringLength(50)]
        public string? BatchNumber { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        
        // Location tracking (if multiple warehouses)
        [StringLength(100)]
        public string? Location { get; set; }
        
        // Computed properties
        public string TransactionDescription => TransactionType switch
        {
            InventoryTransactionType.Purchase => "Nhập hàng",
            InventoryTransactionType.Sale => "Bán hàng",
            InventoryTransactionType.Return => "Trả hàng",
            InventoryTransactionType.Adjustment => "Điều chỉnh",
            InventoryTransactionType.Transfer => "Chuyển kho",
            InventoryTransactionType.Damaged => "Hàng hỏng",
            InventoryTransactionType.Expired => "Hết hạn",
            InventoryTransactionType.Promotion => "Khuyến mãi",
            _ => "Khác"
        };
    }
}
