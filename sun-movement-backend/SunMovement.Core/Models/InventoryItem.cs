using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public enum InventoryStatus
    {
        Available = 0,      // Có sẵn
        Reserved = 1,       // Đã được đặt trước
        Used = 2,          // Đã được sử dụng để tạo sản phẩm
        Expired = 3,       // Hết hạn
        Damaged = 4,       // Hỏng
        Returned = 5       // Trả lại
    }

    public class InventoryItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Sku { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? Barcode { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal CostPrice { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; } // Vị trí trong kho
        
        [StringLength(50)]
        public string? BatchNumber { get; set; } // Số lô/batch
        
        public DateTime ReceiptDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? ExpiryDate { get; set; }
        
        public InventoryStatus Status { get; set; } = InventoryStatus.Available;
        
        // Foreign keys
        public int SupplierId { get; set; }
        public virtual Supplier? Supplier { get; set; }
        
        // Additional properties
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        [StringLength(100)]
        public string? CreatedBy { get; set; }
        
        [StringLength(100)]
        public string? UpdatedBy { get; set; }
        
        // Navigation properties
        public virtual ICollection<InventoryTransaction> Transactions { get; set; } = new List<InventoryTransaction>();
        public virtual ICollection<Product> ProductsCreated { get; set; } = new List<Product>();
        
        // Computed properties
        public bool IsExpired => ExpiryDate.HasValue && ExpiryDate.Value < DateTime.UtcNow;
        public bool IsExpiringSoon => ExpiryDate.HasValue && ExpiryDate.Value <= DateTime.UtcNow.AddDays(30);
        public bool IsAvailable => Status == InventoryStatus.Available && Quantity > 0 && !IsExpired;
        public int DaysInStock => (DateTime.UtcNow - ReceiptDate).Days;
        public bool IsLongTermStock => DaysInStock > 90; // Hàng tồn kho lâu
        
        public string StatusDisplayText => Status switch
        {
            InventoryStatus.Available => IsExpired ? "Đã hết hạn" : 
                                        IsExpiringSoon ? "Sắp hết hạn" : 
                                        "Có sẵn",
            InventoryStatus.Reserved => "Đã đặt trước",
            InventoryStatus.Used => "Đã sử dụng",
            InventoryStatus.Expired => "Hết hạn",
            InventoryStatus.Damaged => "Hỏng",
            InventoryStatus.Returned => "Trả lại",
            _ => Status.ToString()
        };
        
        public string StatusCssClass => Status switch
        {
            InventoryStatus.Available => IsExpired ? "badge-danger" :
                                        IsExpiringSoon ? "badge-warning" :
                                        "badge-success",
            InventoryStatus.Reserved => "badge-info",
            InventoryStatus.Used => "badge-primary",
            InventoryStatus.Expired => "badge-danger",
            InventoryStatus.Damaged => "badge-danger",
            InventoryStatus.Returned => "badge-secondary",
            _ => "badge-secondary"
        };
    }
}
