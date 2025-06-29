using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Admin.Models
{
    public class CouponProductsViewModel
    {
        // Cho case gán coupon cho một sản phẩm cụ thể
        public Product? Product { get; set; }
        public List<int> SelectedCouponIds { get; set; } = new List<int>();
        public IEnumerable<Coupon> AllCoupons { get; set; } = new List<Coupon>();
        
        // Cho case gán sản phẩm cho một coupon cụ thể
        public int SelectedCouponId { get; set; }
        public List<int> SelectedProductIds { get; set; } = new List<int>();
        public IEnumerable<Product> AllProducts { get; set; } = new List<Product>();
    }
}
