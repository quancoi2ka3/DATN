using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Api.Models
{    public class RegisterModel
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
            ErrorMessage = "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt")]
        public required string Password { get; set; }
        
        [Required(ErrorMessage = "Họ là bắt buộc")]
        public required string FirstName { get; set; }
        
        [Required(ErrorMessage = "Tên là bắt buộc")]
        public required string LastName { get; set; }
        
        public string? DateOfBirth { get; set; }
        
        [Required(ErrorMessage = "Địa chỉ là bắt buộc")]
        public required string Address { get; set; }
        
        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public required string PhoneNumber { get; set; }
        
        // Helper property to parse DateOfBirth string to DateTime
        public DateTime? ParsedDateOfBirth 
        {
            get 
            {
                if (string.IsNullOrEmpty(DateOfBirth))
                    return null;
                    
                if (DateTime.TryParse(DateOfBirth, out DateTime result))
                    return result;
                    
                return null;
            }
        }
    }    public class VerifyEmailModel
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "Mã xác thực là bắt buộc")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Mã xác thực phải có 6 chữ số")]
        public required string VerificationCode { get; set; }
    }

    public class ResendVerificationModel
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public required string Email { get; set; }
    }

    public class LoginModel
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public required string Password { get; set; }
    }

    public class TestEmailModel
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }

    public class TestPasswordModel
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        public required string Password { get; set; }
    }
}
