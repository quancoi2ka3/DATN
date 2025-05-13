namespace SunMovement.Web.Models
{
    public class AdminDashboardViewModel
    {
        public int ProductCount { get; set; }
        public int ServiceCount { get; set; }
        public int OrderCount { get; set; }
        public int EventCount { get; set; }
        public int FAQCount { get; set; }
        public int UnreadMessageCount { get; set; }
        public int TotalMessageCount { get; set; }
        public int UserCount { get; set; }
        public object? RecentOrders { get; set; }
    }
}
