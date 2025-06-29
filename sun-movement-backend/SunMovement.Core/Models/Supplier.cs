using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Tên nhà cung cấp là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên nhà cung cấp không được vượt quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Người liên hệ là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên người liên hệ không được vượt quá 100 ký tự")]
        public string ContactPerson { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự")]
        public string Phone { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Địa chỉ là bắt buộc")]
        [StringLength(500, ErrorMessage = "Địa chỉ không được vượt quá 500 ký tự")]
        public string Address { get; set; } = string.Empty;
        
        [Url(ErrorMessage = "Website không hợp lệ")]
        [StringLength(200, ErrorMessage = "Website không được vượt quá 200 ký tự")]
        public string Website { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự")]
        public string Description { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<ProductSupplier> ProductSuppliers { get; set; } = new List<ProductSupplier>();
        public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
    }
}
