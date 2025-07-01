using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Web.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn hàng từ kho")]
        [Display(Name = "Chọn hàng từ kho")]
        public int InventoryItemId { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên sản phẩm không được vượt quá 200 ký tự")]
        [Display(Name = "Tên sản phẩm")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        [StringLength(2000, ErrorMessage = "Mô tả không được vượt quá 2000 ký tự")]
        [Display(Name = "Mô tả")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giá bán là bắt buộc")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        [Display(Name = "Giá bán (VNĐ)")]
        public decimal Price { get; set; }

        [Display(Name = "Giá khuyến mãi (VNĐ)")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá khuyến mãi phải >= 0")]
        public decimal? DiscountPrice { get; set; }

        [Display(Name = "Hình ảnh")]
        public string? ImageUrl { get; set; }

        [Display(Name = "Upload hình ảnh")]
        public IFormFile? ImageFile { get; set; }

        [Required(ErrorMessage = "Danh mục là bắt buộc")]
        [Display(Name = "Danh mục")]
        public ProductCategory Category { get; set; }

        [Display(Name = "Danh mục con")]
        [StringLength(100)]
        public string SubCategory { get; set; } = string.Empty;

        [Display(Name = "Áp dụng mã giảm giá")]
        public List<int> SelectedCouponIds { get; set; } = new List<int>();

        [Display(Name = "SKU")]
        [StringLength(50)]
        public string? Sku { get; set; }

        [Display(Name = "Barcode")]
        [StringLength(50)]
        public string? Barcode { get; set; }

        [Display(Name = "Cân nặng (gram)")]
        [Range(0, double.MaxValue, ErrorMessage = "Cân nặng phải >= 0")]
        public decimal Weight { get; set; } = 0;

        [Display(Name = "Kích thước (L x W x H cm)")]
        [StringLength(100)]
        public string? Dimensions { get; set; }

        [Display(Name = "Ngưỡng tồn kho tối thiểu")]
        [Range(0, int.MaxValue, ErrorMessage = "Ngưỡng tối thiểu phải >= 0")]
        public int MinimumStockLevel { get; set; } = 5;

        [Display(Name = "Ngưỡng tồn kho tối ưu")]
        [Range(0, int.MaxValue, ErrorMessage = "Ngưỡng tối ưu phải >= 0")]
        public int OptimalStockLevel { get; set; } = 50;

        [Display(Name = "Sản phẩm nổi bật")]
        public bool IsFeatured { get; set; } = false;

        [Display(Name = "Theo dõi tồn kho")]
        public bool TrackInventory { get; set; } = true;

        [Display(Name = "Cho phép đặt hàng khi hết kho")]
        public bool AllowBackorder { get; set; } = false;

        [Display(Name = "Kích hoạt")]
        public bool IsActive { get; set; } = true;

        [Display(Name = "Thông số kỹ thuật")]
        public string? Specifications { get; set; }

        // Các thuộc tính chỉ đọc (từ InventoryItem)
        public decimal CostPrice { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public int AvailableQuantity { get; set; }
        public DateTime InventoryReceiptDate { get; set; }

        // Legacy properties for backward compatibility
        public bool IsAvailable => IsActive && AvailableQuantity > 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int StockQuantity { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string SKU => Sku ?? string.Empty;

        // Computed properties
        public decimal ProfitAmount => Price - CostPrice;
        public decimal ProfitPercentage => CostPrice > 0 ? (ProfitAmount / CostPrice) * 100 : 0;
        public bool HasDiscount => DiscountPrice.HasValue && DiscountPrice > 0 && DiscountPrice < Price;
        public decimal EffectivePrice => DiscountPrice ?? Price;

        // Navigation properties for display
        public string InventoryItemName { get; set; } = string.Empty;
        public List<CouponViewModel> AvailableCoupons { get; set; } = new List<CouponViewModel>();
        public List<CouponViewModel> SelectedCoupons { get; set; } = new List<CouponViewModel>();
    }
}
