using System;

namespace SunMovement.Core.Models
{
    public enum FAQCategory
    {
        General,
        Services,
        Products,
        Payment,
        Delivery,
        Returns
    }

    public class FAQ
    {
        public int Id { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public FAQCategory Category { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
