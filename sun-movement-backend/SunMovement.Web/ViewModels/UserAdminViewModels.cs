using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace SunMovement.Web.ViewModels
{
    public class UserAdminViewModel
    {
        public string Id { get; set; } = string.Empty;
        
        [Display(Name = "Tên đăng nhập")]
        public string? UserName { get; set; }
        
        [Display(Name = "Email")]
        public string? Email { get; set; }
        
        [Display(Name = "Họ")]
        public string? FirstName { get; set; }
        
        [Display(Name = "Tên")]
        public string? LastName { get; set; }
        
        [Display(Name = "Số điện thoại")]
        public string? PhoneNumber { get; set; }
        
        [Display(Name = "Email đã xác nhận")]
        public bool EmailConfirmed { get; set; }
        
        [Display(Name = "Thời gian khóa")]
        public DateTimeOffset? LockoutEnd { get; set; }
        
        [Display(Name = "Đã bị khóa")]
        public bool IsLockedOut { get; set; }
        
        [Display(Name = "Vai trò")]
        public List<string> Roles { get; set; } = new List<string>();
        
        [Display(Name = "Ngày tạo")]
        public DateTime CreatedAt { get; set; }
        
        [Display(Name = "Họ và tên")]
        public string FullName => $"{FirstName} {LastName}".Trim();
    }

    public class CreateUserViewModel
    {
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [Display(Name = "Tên đăng nhập")]
        public string UserName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StringLength(100, ErrorMessage = "Mật khẩu phải có ít nhất {2} ký tự.", MinimumLength = 8)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; } = string.Empty;
        
        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Mật khẩu và xác nhận mật khẩu không khớp.")]
        public string ConfirmPassword { get; set; } = string.Empty;
        
        [Display(Name = "Họ")]
        public string? FirstName { get; set; }
        
        [Display(Name = "Tên")]
        public string? LastName { get; set; }
        
        [Display(Name = "Số điện thoại")]
        public string? PhoneNumber { get; set; }
        
        [Display(Name = "Vai trò")]
        public List<string>? SelectedRoles { get; set; }
        
        public List<SelectListItem> AvailableRoles { get; set; } = new List<SelectListItem>();
    }

    public class EditUserViewModel
    {
        public string Id { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [Display(Name = "Tên đăng nhập")]
        public string UserName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
        
        [Display(Name = "Họ")]
        public string? FirstName { get; set; }
        
        [Display(Name = "Tên")]
        public string? LastName { get; set; }
        
        [Display(Name = "Số điện thoại")]
        public string? PhoneNumber { get; set; }
        
        [Display(Name = "Email đã xác nhận")]
        public bool EmailConfirmed { get; set; }
        
        [Display(Name = "Vai trò")]
        public List<string>? SelectedRoles { get; set; }
        
        public List<SelectListItem> AvailableRoles { get; set; } = new List<SelectListItem>();
    }

    public class ResetPasswordViewModel
    {
        public string UserId { get; set; } = string.Empty;
        
        public string UserName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Mật khẩu mới là bắt buộc")]
        [StringLength(100, ErrorMessage = "Mật khẩu phải có ít nhất {2} ký tự.", MinimumLength = 8)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu mới")]
        public string NewPassword { get; set; } = string.Empty;
        
        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu mới")]
        [Compare("NewPassword", ErrorMessage = "Mật khẩu và xác nhận mật khẩu không khớp.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
