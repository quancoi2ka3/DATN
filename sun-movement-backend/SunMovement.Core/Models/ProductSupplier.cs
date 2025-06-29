using System;

namespace SunMovement.Core.Models
{
    public class ProductSupplier
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        public int SupplierId { get; set; }
        public virtual Supplier? Supplier { get; set; }
        public decimal DefaultUnitPrice { get; set; } // Giá mặc định từ NCC
        public int LeadTimeDays { get; set; } = 7; // Thời gian giao hàng trung bình (ngày)
        public string SupplierProductCode { get; set; } = string.Empty; // Mã sản phẩm của NCC
        public bool IsPreferredSupplier { get; set; } = false; // Nhà cung cấp ưu tiên
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
