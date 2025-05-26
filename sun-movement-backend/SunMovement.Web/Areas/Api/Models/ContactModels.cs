using System.ComponentModel.DataAnnotations;

namespace SunMovement.Web.Areas.Api.Models
{
    public class ContactFormModel
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Subject { get; set; }

        [Required]
        public required string Message { get; set; }
    }
}
