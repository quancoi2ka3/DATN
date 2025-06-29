using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.ViewModels
{
    public class InventoryItemViewModel
    {
        public int Id { get; set; }
        
        [Display(Name = "Tên hàng hóa")]
        public string Name { get; set; } = string.Empty;
        
        [Display(Name = "Mô tả")]
        public string Description { get; set; } = string.Empty;
        
        [Display(Name = "SKU")]
        public string Sku { get; set; } = string.Empty;
        
        [Display(Name = "Số lượng tồn kho")]
        public int Quantity { get; set; }
        
        [Display(Name = "Giá nhập")]
        public decimal CostPrice { get; set; }
        
        [Display(Name = "Nhà cung cấp")]
        public string SupplierName { get; set; } = string.Empty;
        
        [Display(Name = "Ngày nhập kho")]
        public DateTime ReceiptDate { get; set; }
        
        [Display(Name = "Ngày hết hạn")]
        public DateTime? ExpiryDate { get; set; }
        
        [Display(Name = "Vị trí kho")]
        public string Location { get; set; } = string.Empty;
        
        [Display(Name = "Batch/Lot")]
        public string BatchNumber { get; set; } = string.Empty;
        
        // Computed properties
        public bool IsExpired => ExpiryDate.HasValue && ExpiryDate.Value < DateTime.UtcNow;
        public bool IsExpiringSoon => ExpiryDate.HasValue && ExpiryDate.Value <= DateTime.UtcNow.AddDays(30);
        public bool IsAvailable => Quantity > 0 && !IsExpired;
        public int DaysInStock => (DateTime.UtcNow - ReceiptDate).Days;
        
        public string StatusText => IsExpired ? "Đã hết hạn" :
                                   IsExpiringSoon ? "Sắp hết hạn" :
                                   Quantity <= 0 ? "Hết hàng" :
                                   "Có sẵn";
        
        public string StatusCssClass => IsExpired ? "badge-danger" :
                                       IsExpiringSoon ? "badge-warning" :
                                       Quantity <= 0 ? "badge-secondary" :
                                       "badge-success";
        
        public string DisplayName => $"{Name} ({Sku})";
        public string DisplayInfo => $"{Name} - SL: {Quantity} - Giá: {CostPrice:N0} VNĐ";
    }
}
