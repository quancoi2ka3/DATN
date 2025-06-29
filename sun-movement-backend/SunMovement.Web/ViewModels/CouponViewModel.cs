using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Web.ViewModels
{
    public class CouponViewModel
    {
        public int Id { get; set; }
        
        [Display(Name = "Mã giảm giá")]
        public string Code { get; set; } = string.Empty;
        
        [Display(Name = "Tên mã giảm giá")]
        public string Name { get; set; } = string.Empty;
        
        [Display(Name = "Mô tả")]
        public string Description { get; set; } = string.Empty;
        
        [Display(Name = "Loại giảm giá")]
        public CouponType Type { get; set; }
        
        [Display(Name = "Giá trị")]
        public decimal Value { get; set; }
        
        [Display(Name = "Ngày bắt đầu")]
        public DateTime StartDate { get; set; }
        
        [Display(Name = "Ngày kết thúc")]
        public DateTime EndDate { get; set; }
        
        [Display(Name = "Trạng thái")]
        public bool IsActive { get; set; }
        
        [Display(Name = "Giới hạn sử dụng")]
        public int UsageLimit { get; set; }
        
        [Display(Name = "Đã sử dụng")]
        public int CurrentUsageCount { get; set; }
        
        [Display(Name = "Giá trị đơn hàng tối thiểu")]
        public decimal MinimumOrderAmount { get; set; }
        
        // Computed properties
        public bool IsExpired => DateTime.UtcNow > EndDate;
        public bool IsNotStarted => DateTime.UtcNow < StartDate;
        public bool IsAvailable => IsActive && !IsExpired && !IsNotStarted && 
                                   (UsageLimit == 0 || CurrentUsageCount < UsageLimit);
        
        public string DisplayValue => Type switch
        {
            CouponType.Percentage => $"{Value:0.##}%",
            CouponType.FixedAmount => $"{Value:N0} VNĐ",
            CouponType.FreeShipping => "Miễn phí vận chuyển",
            CouponType.BuyOneGetOne => "Mua 1 tặng 1",
            _ => Value.ToString("N0")
        };
        
        public string StatusText => IsAvailable ? "Có thể sử dụng" : 
                                   IsExpired ? "Đã hết hạn" :
                                   IsNotStarted ? "Chưa bắt đầu" :
                                   !IsActive ? "Không hoạt động" :
                                   "Đã hết lượt sử dụng";
        
        public string StatusCssClass => IsAvailable ? "badge-success" :
                                       IsExpired ? "badge-danger" :
                                       IsNotStarted ? "badge-warning" :
                                       !IsActive ? "badge-secondary" :
                                       "badge-info";
    }
}
