using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.ViewModels
{
    public class CheckoutViewModel
    {
        public ShoppingCartViewModel Cart { get; set; }

        [Required]
        [Display(Name = "Full Name")]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }

        [Required]
        [Display(Name = "Address")]
        public string Address { get; set; }

        [Display(Name = "Notes")]
        public string Notes { get; set; }
    }
}
