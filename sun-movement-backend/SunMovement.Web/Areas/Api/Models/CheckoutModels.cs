using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Api.Models
{
    public class CheckoutCreateModel
    {
        [Required]
        public ShippingAddressModel ShippingAddress { get; set; } = new();
        
        [Required]
        public ContactInfoModel ContactInfo { get; set; } = new();
        
        [Required]
        public string PaymentMethod { get; set; } = "cash_on_delivery";
    }

    public class ShippingAddressModel
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        public string AddressLine1 { get; set; } = string.Empty;
        
        public string? AddressLine2 { get; set; }
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string Province { get; set; } = string.Empty;
        
        public string? ZipCode { get; set; }
    }

    public class ContactInfoModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Phone { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
    }

    public class TestCheckoutModel
    {
        [Required]
        public ShippingAddressModel ShippingAddress { get; set; } = new();
        
        [Required]
        public ContactInfoModel ContactInfo { get; set; } = new();
        
        [Required]
        public string PaymentMethod { get; set; } = "cod";
    }
}
